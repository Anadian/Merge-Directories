#!/usr/local/bin/node

//Internal
//Standard
const FileSystem = require('fs');
const Path = require('path');
const Cryptography = require('crypto');
//External
const CommandLineArguments = require('command-line-args');
const CommandLineUsage = require('command-line-usage');

const SHA256 = Cryptography.createHash('sha256');

function Directory_Information( directory, symlink, recurse ){
	var _return = [1, null];
	var directory_stats = null;
	var readdir_return = null;
	var directory_information_array = [];
	var file_information_object = {};
	var directory_information_return = null;
	var file_data = '';
	if( directory != null ){
		if( FileSystem.existsSync(directory) === true ){
			directory_stats = FileSystem.lstatSync(directory);
			if( directory_stats.isDirectory() === true ){
				readdir_return = FileSystem.readdirSync(directory, 'utf8');
				for( var i = 0; i < readdir_return.length; i++ ){
					file_information_object = {
						name: readdir_return[i],
						path: Path.join( directory, readdir_return[1] )
					};
					file_information_object.stats: FileSystem.lstatSync( file_information_object.path );
					if( ( file_information_object.stats.isDirectory() === true ) && ( recurse === true ) ){
						 directory_information_return = Directory_Information( file_information_object.path, true );
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
		}
	}
	return _return;
}

if( require.main === module ){
	//Run
	const CLI_Definitions = [
		{
			header: 'Merge-Directories',
			content: 'Merge two directories into one directory, maintaining the newest version of each file.'
		},
		{
			header: 'Options',
			optionList: [
				{name: 'help', alias: 'h', type: Boolean, description: 'Print this help text to stdout.'},
				{name: 'directory-a', alias: 'A', type: String, description: 'Input directory "A".'},
				{name: 'directory-b', alias: 'B', type: String, description: 'Input directory "B".'},
				{name: 'output-directory', alias: 'O', type: String, description: 'Output directory, will be created if it doesn\'t exist: unless "--exclusive" is also specified.'},
				{name: 'recursive', alias: 'r', type: Boolean, description: 'Include any subdirectories, and their contents, encountered.'},
				{name: 'symlink', alias: 'l', type: Boolean, description: 'Stat the symlink files themselves (lstat) instead of the files they point to. (stat)'},
				{name: 'accessed', alias: 'a', type: Boolean, description: 'Prefer the version with the most recent access time.'},
				{name: 'modified', alias: 'm', type: Boolean, description: 'Prefer the version with the most recent modification time.'},
				{name: 'changed', alias: 'c', type: Boolean, description: 'Prefer the version with the most recent stat-change time.'},
				{name: 'exclusive', alias: 'x', type: Boolean, description: 'Exit if the output directory specified does not already exist.'}
			]
		}
	];
	const Options = CommandLineArguments(CLI_Definitions[1].optionList);
	if( Options.help != null ){
		console.log(CommandLineUsage(CLI_Definitions));
	} else{
		if( ( Options.directory-a != null ) && ( Options.directory-b != null ) && ( Options.output-directory != null ) ){ //required arguments specified
			
			
		
} else{
	//Imported
}
