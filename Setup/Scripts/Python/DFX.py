
import subprocess, sys, os, shutil, json, io
from pathlib import Path
pybin = sys.executable#
join = os.path.join
cwd = os.getcwd()

def remove_frontend(filename='data.json'):
	with open(filename,'r+') as file:
		file_data = json.load(file) # First we load existing data into a dict.
		if "frontend" in file_data["canisters"]:
			del file_data["canisters"]["frontend"] # Join new_data with file_data inside emp_details
			file.seek(0) # Sets file's current position at offset.
			json.dump(file_data, file, indent = 4) # convert back to json.

# write_json(frontend_canister) 
arg = sys.argv[1] if len(sys.argv)>1 else ""
dfx_file = join(cwd, "ICP/B3/dfx.json")
original_dfx_file = join(cwd, "ICP/B3/-dfx.json")

if arg=="backup":
	if not os.path.isfile(original_dfx_file): dest = shutil.copy2(dfx_file, original_dfx_file) 
	remove_frontend(dfx_file)

elif arg=="restore":
	dest = shutil.copy2(original_dfx_file, dfx_file)
	# os.remove(original_dfx_file)

elif arg=="clean":
	try: os.remove(join(cwd, '.env'))
	except OSError: pass

elif arg=="candid":
	shutil.copytree(join(cwd, 'ICP/B3/src/declarations'), join(cwd, 'Medusa/Canistro/Declarations'), dirs_exist_ok=True)
	env_files= [join(cwd, 'ICP/B3/.env')]
	lines = io.StringIO()   #file like object to store all lines
	with open(join(cwd, '.env'), 'a') as env_main:
		for env_path in env_files:
			env_main.write(f'# CANISTER_IDs from {env_path.replace(cwd, "")}\n')
			with open(env_path, 'r') as env_file:
				for line in env_file:
					if line.startswith('CANISTER_ID_'): env_main.write(line)
	# with open(env_main, 'a') as fd:
	# 	lines.seek(0)        # now you can treat this like a file like object
	# 	shutil.copyfileobj(lines, fd)