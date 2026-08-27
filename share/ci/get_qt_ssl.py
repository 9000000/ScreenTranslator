import common as c
from config import ssl_dir, os_name
import sys
import os

c.print('>> Downloading ssl for Qt for {}'.format(os_name))

if os_name == 'linux':
    os.makedirs('ssl/lib', exist_ok=True)
    c.print('>> Linux build: skipped downloading openssl (relying on host system OpenSSL)')
    sys.exit(0)
elif os_name == 'macos':
    sys.exit(0)
elif os_name == 'win32':
    url = 'https://wiki.overbyte.eu/arch/openssl-1.1.1w-win32.zip'
    file_name = 'openssl-1.1.1w-win32.zip'
elif os_name == 'win64':
    url = 'https://wiki.overbyte.eu/arch/openssl-1.1.1w-win64.zip'
    file_name = 'openssl-1.1.1w-win64.zip'
else:
    c.print('>> Unknown OS: {}'.format(os_name))
    sys.exit(1)

# Download and extract the OpenSSL DLLs into ssl/bin
dest_dir = os.path.join(ssl_dir, 'bin')
os.makedirs(dest_dir, exist_ok=True)

c.download(url, file_name)
c.extract(file_name, dest_dir)
