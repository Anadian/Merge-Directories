#!/usr/local/bin/node

//Internal
const Log = require('./log.js');
//Standard
const FileSystem = require('fs');
const Path = require('path');
const Cryptography = require('crypto');
//External

const SHA256 = Cryptography.createHash('sha256');

function Directory_Information( directory, symlink, recurse ){
	Log.log(PROCESS_NAME,MODULE_NAME,FILENAME,FUNCTION_NAME,'debug','Directory_Information received: ', directory, symlink, recurse);
	var _return = [1, null];
	var directory_stats = null;
	var readdir_return = null;
	var directory_information_array = [];
	var file_information_object = {};
	var directory_information_return = null;
	var file_data = '';
	if( directory != null ){
		if( FileSystem.existsSync(directory) === true ){
			if( symlink === true ){
				directory_stats = FileSystem.lstatSync(directory);
			} else{
				directory_stats = FileSystem.statSync(directory);
			}
			if( directory_stats.isDirectory() === true ){
				readdir_return = FileSystem.readdirSync(directory, 'utf8');
				Log.log(PROCESS_NAME,MODULE_NAME,FILENAME,FUNCTION_NAME,'debug','readdir_return: ', readdir_return);

				for( var i = 0; i < readdir_return.length; i++ ){
					file_information_object = {
						name: readdir_return[i],
						path: Path.join( directory, readdir_return[1] )
					};
					if( symlink === true ){
						file_information_object.stats = FileSystem.lstatSync( file_information_object.path );
					} else{
						file_information_object.stats = FileSystem.statSync( file_information_object.path );
					}	
					if( ( file_information_object.stats.isDirectory() === true ) && ( recurse === true ) ){
						 directory_information_return = Directory_Information( file_information_object.path, symlink, true );
						 if( directory_information_return[0] === 0 ){
						 	file_information_object.contents = directory_information_return[1];
						}
					} else if( file_information_object.stats.isFile() === true ){
						file_data = FileSystem.readFileSync( file_information_object.path, 'utf8' );
						SHA256.update( file_data, 'utf8' );
						file_information_object.sha256 = SHA256.digest('hex');
					}
					directory_information_array.push(file_information_object);
				}
				if( directory_information_array != [] ){
					_return = [0, directory_information_array];
				}
			}
		} else{
			Log.log(PROCESS_NAME,MODULE_NAME,FILENAME,FUNCTION_NAME,'debug','"directory" does not exist.');

		}
	} else{
		Log.log(PROCESS_NAME,MODULE_NAME,FILENAME,FUNCTION_NAME,'debug','"directory" not a valid string: ', directory);

	}
	Log.log(PROCESS_NAME,MODULE_NAME,FILENAME,FUNCTION_NAME,'debug','Directory_Information returned: ', _return);

	return _return;
}

if( require.main === module ){
	const CommandLineArguments = require('command-line-args');
	const CommandLineUsage = require('command-line-usage');

	const CLI_Definitions = [
		{
			header: 'Directory-Information',
			content: 'Get exhaustive directory information in JSON format.'
		},
		{
			header: 'Options',
			optionList: [
				{name: 'help', alias: 'h', type: Boolean, description: 'Print this help text to stdout.'},
				{name: 'input_directory', alias: 'I', type: String, defaultOption: true, description: 'Input directory.'},
				{name: 'stdout', alias: 'o', type: Boolean, description: 'Output to stdout.'},
				{name: 'output_file', alias: 'O', type: String, description: 'Output file.'},
				{name: 'recursive', alias: 'r', type: Boolean, description: 'Include any subdirectories, and their contents, encountered.'},
				{name: 'symlink', alias: 'l', type: Boolean, description: 'Stat the symlink files themselves (lstat) instead of the files they point to. (stat)'}
			]
		}
	];
	const Options = CommandLineArguments(CLI_Definitions[1].optionList);
	if( Options.help === true ){
		console.log(CommandLineUsage(CLI_Definitions));
	} else{
		if( Options.input_directory != null ){
			var directory_information_return = Directory_Information( Options.input_directory, Options.symlink, Options.recursive );
			if( directory_information_return[0] === 0 ){
				var json_string = JSON.stringify( directory_information_return[1], null, '\t' );
				if( typeof(Options.output_file) === 'string' ){
					FileSystem.writeFileSync( json_string, Options.output_file, 'utf8' );
				} else{
					console.log(json_string);
				}
			}
		}
	}
}

