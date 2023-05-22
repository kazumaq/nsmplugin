# NSM Syntax Analysis Plugin for VSCode

This is an extensible VSCode plugin designed to enhance user experience when working with Natural Semantic Metalanguage (NSM) texts. The plugin provides support for NSM syntax in text files with the `.nsm` extension. Key features include error detection, error highlighting and suggestions for fixes.

This VSCode extension aims to aid people who work with NSM by improving the convenience of writing, analyzing, and understanding NSM texts.

## Features

- **Error Detection and Highlighting**: Identifies invalid words or undefined molecules in NSM syntax and visually marks them for easy recognition.

- **Suggestions for Fixes**: Provides helpful recommendations for rectifying syntax errors.

- **VSCode IntelliSense Integration**: Offers autocompletion suggestions for NSM primes, molecules, and auxiliary words.

- **Extensibility**: Designed with a modular structure to facilitate future expansion and the addition of new features.

## More about it

The NSM plugin recognizes and supports all NSM primes as well as auxiliary words. It has been structured to simplify syntax highlighting by consolidating NSM primes into fewer categories.

The plugin defines a formal NSM grammar that specifies how primes, auxiliary words, and molecules can be combined in NSM syntax. This includes defining rules for basic sentence structure, negation, conditional statements, tense and aspect, comparisons, pronouns and determiners, and the use of auxiliary words and molecules.

Guidelines have been established for defining and using molecules in the plugin, which includes the use of configuration files for managing molecules and syntax rules. The plugin also supports basic NSM grammar structures such as subject-verb-object, negation, and question formation.

In the context of NSM syntax, the plugin provides a set of rules detailing valid combinations of primes, molecules, and auxiliary words, and uses examples to illustrate these rules. It also converts this formal grammar into a TextMate grammar, which is a format that VSCode can understand.

## Usage

To use this plugin, simply install it to your VSCode environment. Upon installation, the plugin will begin to provide NSM syntax support for files with the `.nsm` extension, enhancing your efficiency and experience when working with NSM texts.

## More Information

For more detailed information, including the full list of NSM primes and auxiliary words supported, examples of valid NSM syntax, and a closer look at the features offered by the plugin, refer to the complete technical specifications.

## Requirements

Visual Studio Code above `1.78`

## Known Issues

See the issues section in the repository.

## Release Notes

### 0.1.0

Initial release of `nsmplugin`
