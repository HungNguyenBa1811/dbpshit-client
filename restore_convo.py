import sqlite3
import base64
import time
import os
import subprocess
import sys

db_path = os.path.expandvars(r'%APPDATA%\Antigravity IDE\User\globalStorage\state.vscdb')
convo_db_path = os.path.expandvars(r'%USERPROFILE%\.gemini\antigravity-ide\conversations\04433c81-9ca9-440f-9817-fb16048449f0.db')

def encode_varint(n):
    res = bytearray()
    while True:
        b = n & 0x7F
        n >>= 7
        if n:
            res.append(b | 0x80)
        else:
            res.append(b)
            break
    return bytes(res)

def encode_tag(field_num, wire_type):
    return encode_varint((field_num << 3) | wire_type)

def encode_len_delim(field_num, data):
    if isinstance(data, str):
        data = data.encode('utf-8')
    return encode_tag(field_num, 2) + encode_varint(len(data)) + data

def encode_varint_field(field_num, val):
    return encode_tag(field_num, 0) + encode_varint(val)

def encode_timestamp(seconds, nanos=0):
    body = encode_varint_field(1, seconds)
    if nanos:
        body += encode_varint_field(2, nanos)
    return body

def parse_protobuf(data):
    i = 0
    items = []
    while i < len(data):
        key = 0
        shift = 0
        while True:
            if i >= len(data): return items
            b = data[i]
            i += 1
            key |= (b & 0x7f) << shift
            if not (b & 0x80): break
            shift += 7
        field_num = key >> 3
        wire_type = key & 0x07
        if wire_type == 0:
            val = 0
            shift = 0
            while True:
                b = data[i]
                i += 1
                val |= (b & 0x7f) << shift
                if not (b & 0x80): break
                shift += 7
            items.append((field_num, 'varint', val))
        elif wire_type == 1:
            val = data[i:i+8]
            i += 8
            items.append((field_num, 'fixed64', val))
        elif wire_type == 2:
            length = 0
            shift = 0
            while True:
                b = data[i]
                i += 1
                length |= (b & 0x7f) << shift
                if not (b & 0x80): break
                shift += 7
            val = data[i:i+length]
            i += length
            items.append((field_num, 'len_delim', val))
        elif wire_type == 5:
            val = data[i:i+4]
            i += 4
            items.append((field_num, 'fixed32', val))
        else:
            break
    return items

def patch_database():
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    row = cur.execute('SELECT value FROM ItemTable WHERE key = ?', ('antigravityUnifiedStateSync.trajectorySummaries',)).fetchone()
    if not row:
        print("Key not found in state.vscdb")
        conn.close()
        return False
    raw = base64.b64decode(row[0])

    convo_db = sqlite3.connect(convo_db_path)
    ccur = convo_db.cursor()
    blob_data = ccur.execute('SELECT data FROM trajectory_metadata_blob WHERE id="main"').fetchone()[0]
    workspace_meta_bytes = parse_protobuf(blob_data)[0][2]

    # Filter out 04433c81 if present
    top_items = parse_protobuf(raw)
    filtered = bytearray()
    for f_num, w_type, val in top_items:
        sub = parse_protobuf(val)
        if sub and sub[0][0] == 1 and sub[0][2].decode('utf-8', errors='ignore') == '04433c81-9ca9-440f-9817-fb16048449f0':
            continue
        filtered += encode_len_delim(1, val)

    # Build summary
    summary_body = bytearray()
    summary_body += encode_len_delim(1, "call https://dbapi.ptit.edu.vn/api/app/contest/question-contest/c67ec22b")
    summary_body += encode_varint_field(2, 236)
    summary_body += encode_len_delim(3, encode_timestamp(1792143885, 0))
    summary_body += encode_len_delim(4, "7c30ea31-1108-4e2d-b4e4-b1428ae095ef")
    summary_body += encode_varint_field(5, 1)
    summary_body += encode_len_delim(7, encode_timestamp(1792142809, 0))
    summary_body += encode_len_delim(9, workspace_meta_bytes)
    summary_body += encode_len_delim(10, encode_timestamp(1792143885, 0))
    summary_body += encode_len_delim(15, b"")
    summary_body += encode_varint_field(16, 2)
    summary_body += encode_len_delim(17, blob_data)
    summary_body += encode_varint_field(22, 4)

    summary_bytes = bytes(summary_body)
    b64_summary = base64.b64encode(summary_bytes).decode('utf-8')
    value_body = encode_len_delim(1, b64_summary)
    entry_body = encode_len_delim(1, "04433c81-9ca9-440f-9817-fb16048449f0") + encode_len_delim(2, value_body)
    new_entry = encode_len_delim(1, entry_body)

    new_raw = filtered + new_entry
    new_val_b64 = base64.b64encode(new_raw).decode('utf-8')

    cur.execute('UPDATE ItemTable SET value = ? WHERE key = ?', (new_val_b64, 'antigravityUnifiedStateSync.trajectorySummaries'))
    conn.commit()
    conn.close()
    convo_db.close()
    print("Patch applied successfully! New count: " + str(len(parse_protobuf(new_raw))))
    return True

if __name__ == '__main__':
    # If wait mode requested
    if '--wait' in sys.argv:
        print("Waiting for Antigravity IDE to close...")
        while True:
            # check tasklist
            output = subprocess.check_output('tasklist /FI "IMAGENAME eq Antigravity IDE.exe"', shell=True, text=True)
            if 'Antigravity IDE.exe' not in output:
                print("Antigravity IDE has exited!")
                break
            time.sleep(1)
        time.sleep(1) # wait for file handle release
        patch_database()
        print("Launching Antigravity IDE...")
        ide_path = os.path.expandvars(r'%LOCALAPPDATA%\Programs\Antigravity IDE\Antigravity IDE.exe')
        subprocess.Popen([ide_path])
        print("Done!")
    else:
        patch_database()
