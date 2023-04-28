# Extensible VSCode Plugin for Natural Semantic Metalanguage Syntax Analysis

## Project Overview

The aim of this project is to develop a comprehensive VSCode plugin that provides robust support for Natural Semantic Metalanguage (NSM) syntax in text files with the `.nsm` extension. The plugin will focus on enhancing the user experience when working with NSM texts by offering several key features, such as error detection, error highlighting, suggestions for fixes, and multilingual support. The plugin will be designed with extensibility in mind, enabling users to define language-specific settings and molecule definitions in configuration files, and allowing for future support of additional languages.

The plugin will integrate seamlessly with the VSCode IntelliSense system to offer autocompletion suggestions for NSM primes, molecules, and auxiliary words, thereby improving the efficiency of writing NSM text. A built-in documentation viewer will be included to provide users with easy access to NSM concepts, syntax rules, and language-specific information, making the learning process more convenient and engaging.

By developing this plugin, we aim to create a valuable tool for researchers, linguists, and other professionals who work with NSM, empowering them to write, analyze, and understand NSM texts more effectively. With its focus on multilingual support, the plugin will also promote cross-cultural understanding and enable users to explore the intricacies of different languages through the lens of NSM.

In summary, the VSCode plugin for NSM syntax support will offer the following key features:

- Error detection and highlighting for invalid words or undefined molecules in NSM syntax
- Multilingual support with easy extensibility to additional languages
- Seamless integration with the VSCode IntelliSense system for autocompletion suggestions
- Configuration files for managing syntax and language settings
- Suggestions for fixing syntax errors
- A built-in documentation viewer for easy access to NSM concepts and syntax rules
- An extensible and modular design, allowing for future expansion and additional features

## Project requirements

- Detect invalid words or undefined molecules in NSM syntax
- Support multiple languages and easy extensibility to other languages
- Integrate with the VSCode IntelliSense system for autocompletion suggestions
- Configuration files for syntax and language settings
- Error highlighting and suggestions for fixes
- Built-in documentation viewer for quick access to NSM concepts and syntax rules

## Implementation Steps

### List of all NSM primes to be recognized and supported by the plugin.

Define the vocabulary, including NSM primes and auxiliary words

| Category                  | Primes                                                                          |
| ------------------------- | ------------------------------------------------------------------------------- |
| Substantives              | I, YOU, SOMEONE, PEOPLE, SOMETHING/THING, BODY                                  |
| Relational Substantives   | KIND, PART                                                                      |
| Determiners               | THIS, THE SAME, OTHER/ELSE/ANOTHER                                              |
| Quantifiers               | ONE, TWO, SOME, ALL, MUCH/MANY, LITTLE/FEW                                      |
| Evaluators                | GOOD, BAD                                                                       |
| Descriptors               | BIG, SMALL                                                                      |
| Mental predicates         | THINK, KNOW, WANT, DON'T WANT, FEEL, SEE, HEAR                                  |
| Speech                    | SAY, WORDS, TRUE                                                                |
| Actions, Events, Movement | DO, HAPPEN, MOVE                                                                |
| Existence, Possession     | BE (SOMEWHERE), THERE IS, BE (SOMEONE/SOMETHING), (IS) MINE                     |
| Life and Death            | LIVE, DIE                                                                       |
| Time                      | WHEN/TIME, NOW, BEFORE, AFTER, A LONG TIME, A SHORT TIME, FOR SOME TIME, MOMENT |
| Space                     | WHERE/PLACE, HERE, ABOVE, BELOW, FAR, NEAR, SIDE, INSIDE, TOUCH (CONTACT)       |
| Logical Concepts          | NOT, MAYBE, CAN, BECAUSE, IF                                                    |
| Intensifier, Augmentor    | VERY, MORE                                                                      |
| Similarity                | LIKE/AS/WAY                                                                     |

Auxiliary words: AND, OR, NOT, IF, OF, THAT, BY, MORE, LESS, THAN, CAN, MUST, SHOULD, SO

### Define the Formal grammar

Specify how the words can be combined in the NSM syntax.

#### Guidelines for defining and using molecules in the plugin.

As part of the guidelines for defining and using molecules in the plugin, we established the following:

1. Molecule Definition:

   - Molecules should be defined as combinations of NSM primes and/or auxiliary words, with specific meanings and uses within a given language.
   - Users should be able to create custom molecules for their language and store them in a separate configuration file.

2. Molecule Usage:

   - When creating NSM expressions, users can utilize pre-defined molecules as building blocks alongside NSM primes and auxiliary words.
   - The plugin should provide syntax highlighting and validation for the molecules, ensuring they are used correctly within the NSM expressions.

3. Molecule Management:
   - Users should have the ability to add, edit, and remove molecules from their language-specific configuration files.
   - The plugin should be able to dynamically update its syntax highlighting and validation rules based on the user-defined molecules.

These guidelines have been incorporated into the development of the plugin, allowing users to define and use molecules effectively within the NSM framework, and enabling the plugin to support language-specific nuances.

#### Support for basic NSM grammar structures, such as subject-verb-object, negation, and question formation.

In order to provide support for basic NSM grammar structures, we incorporated the following features into the plugin:

1. Subject-Verb-Object (SVO) Structure:

   - The plugin recognizes and supports the basic SVO structure, ensuring that NSM expressions are formed with valid syntax.
   - Syntax highlighting and validation are applied to SVO structures, allowing users to easily identify and correct any syntax issues.

2. Negation:

   - The plugin supports negation by recognizing the NSM prime "NOT" and its correct usage in NSM expressions.
   - Syntax highlighting and validation are provided for negation structures, ensuring that users can effectively negate their expressions.

3. Question Formation:
   - The plugin supports the formation of questions by recognizing specific patterns and structures used for interrogative NSM expressions.
   - Syntax highlighting and validation are applied to question structures, guiding users in forming valid questions within the NSM framework.

These features ensure that the plugin accurately supports basic NSM grammar structures, making it easier for users to work with NSM expressions and maintain correct syntax.

#### Syntax Rules

##### A set of syntax rules for NSM expressions that detail valid combinations of primes, molecules, and auxiliary words.

As part of our work, we defined syntax rules for NSM expressions to ensure proper structure and meaningful combinations of NSM primes, molecules, and auxiliary words. Here's an overview of the main syntax rules:

1. Basic sentence structure:

   - NSM expressions should follow a subject-verb-object (SVO) structure, where applicable, using NSM primes or molecules for each component.

2. Negation:

   - Negation is achieved by using the NSM prime "NOT" in combination with a verb or an adjective.

3. Auxiliary words:

   - Auxiliary words, such as "AND," "OR," "IF," "THAN," "CAN," "MUST," "SHOULD," and "SO," can be used to connect or relate NSM primes and molecules within an expression.

4. Molecules:

   - Molecules are language-specific combinations of NSM primes and auxiliary words. They can be used in place of a prime within an NSM expression.
   - Molecules must be constructed using valid NSM primes and, where necessary, auxiliary words.

5. Pronouns and determiners:

   - NSM expressions should use appropriate pronouns (e.g., I, YOU, SOMEONE) and determiners (e.g., THIS, THE_SAME, OTHER) to provide context and specificity.

6. Tense and aspect:

   - When expressing tense or aspect, NSM expressions should use appropriate NSM primes, such as "BEFORE," "AFTER," "NOW," "FOR_SOME_TIME," and "MOMENT."

7. Conditional statements:

   - Conditional statements should use the NSM prime "IF" in combination with other NSM primes or molecules to express hypothetical situations or consequences.

8. Comparisons:
   - Comparisons should use NSM primes like "MORE," "LESS," "LIKE," and "AS," along with appropriate auxiliary words, to relate two or more NSM expressions.

These syntax rules provide a framework for constructing meaningful NSM expressions, ensuring that they adhere to the principles of the NSM theory and maintain coherence across different languages.

#### Examples

To provide a clear understanding of the syntax rules for NSM expressions, we have outlined valid combinations of primes, molecules, and auxiliary words. Here are some examples to illustrate these rules:

1. Basic SVO Structure:

   - A valid SVO structure in NSM consists of a subject (S), a verb (V), and an object (O), using NSM primes or molecules.

   Example:

   ```
   I SEE SOMETHING
   ```

   In this example, "I" is the subject, "SEE" is the verb, and "SOMETHING" is the object. All components are NSM primes, making this a valid NSM expression.

2. Negation:

   - Negation is achieved by using the NSM prime "NOT" in combination with a verb or an adjective.

   Example:

   ```
   I NOT WANT SOMETHING
   ```

   In this example, the negation "NOT" is used with the verb "WANT" to indicate the subject's lack of desire for something.

3. Auxiliary Words:

   - Auxiliary words, such as "AND," "OR," and "IF," can be used to combine or relate NSM primes and molecules.

   Example:

   ```
   I FEEL GOOD AND I WANT SOMETHING
   ```

   In this example, the auxiliary word "AND" is used to combine two separate NSM expressions: "I FEEL GOOD" and "I WANT SOMETHING."

4. Molecules:

   - Molecules are language-specific combinations of NSM primes and auxiliary words. They can be used in place of a prime within an NSM expression.

   Example (molecule: LONG_TIME = A_LONG_TIME + FOR_SOME_TIME):

   ```
   I LIVE HERE FOR A_LONG_TIME FOR_SOME_TIME
   ```

   In this example, the molecule "LONG_TIME" is formed by combining the primes "A_LONG_TIME" and "FOR_SOME_TIME." The molecule is used within the expression to indicate the duration of time the subject has lived in a specific location.

These examples demonstrate some of the syntax rules for NSM expressions, ensuring that users can create valid combinations of primes, molecules, and auxiliary words.

### Grammar rules

Based on the syntax structures described earlier, we can create a formal grammar that specifies how these words can be combined.

Here are the NSM syntax rules represented in EBNF:

```
/*
File: src/grammars/nsm_grammar.ebnf
Natural Semantic Metalanguage (NSM) Grammar
------------------------------------------
This EBNF grammar represents the structure of NSM, a theoretical approach to
language that aims to capture the universal features of human languages using a
set of semantic primes. The grammar includes simple clauses, complex clauses,
questions, negations, and molecules.
*/

Expression ::= SimpleClause | ComplexClause | Question | Negation | Molecule

/* Simple Clauses */
SimpleClause ::= PredicatePhrase
PredicatePhrase ::= Subject PrimePredicatePhraseObject {PrimePredicatePhraseObject}
Subject ::= SubstantivePrime

/* Complex Clauses */
ComplexClause ::= IfClause | QuasiRelativeClause | AdverbialClause | AnalogyClause
IfClause ::= "IF" Expression "THEN" Expression
QuasiRelativeClause ::= SubstantivePrime "WHERE" Expression
AdverbialClause ::= ("WHEN" | "BECAUSE") Expression
AnalogyClause ::= Expression "LIKE" Expression "AS" Expression

/* Predicate Phrase Objects */
PrimePredicatePhraseObject ::= (SubstantivePrime | RelationalSubstantivePrime | DeterminerPhrase | QuantifierPhrase | EvaluatorPhrase | DescriptorPhrase | MentalPredicatePrime | SpeechPredicatePrime | ActionEventMovementPredicatePrime | ExistencePossessionPredicatePrime | LifeDeathPredicatePrime | TimePredicatePrime | SpacePredicatePrime | LogicalConceptPrime | IntensifierAugmentorPrime | SimilarityPrime | Molecule)

/* Determiner, Quantifier, Evaluator, and Descriptor Phrases */
DeterminerPhrase ::= DeterminerPrime SubstantivePrime
QuantifierPhrase ::= QuantifierPrime SubstantivePrime
EvaluatorPhrase ::= EvaluatorPrime SubstantivePrime
DescriptorPhrase ::= DescriptorPrime SubstantivePrime

/* NSM Prime Categories */
SubstantivePrime ::= "I" | "YOU" | "SOMEONE" | "PEOPLE" | "SOMETHING" | "THING" | "BODY"
RelationalSubstantivePrime ::= "KIND" | "PART"
DeterminerPrime ::= "THIS" | "THE_SAME" | "OTHER" | "ELSE" | "ANOTHER"
QuantifierPrime ::= "ONE" | "TWO" | "SOME" | "ALL" | "MUCH" | "MANY" | "LITTLE" | "FEW"
EvaluatorPrime ::= "GOOD" | "BAD"
DescriptorPrime ::= "BIG" | "SMALL"
MentalPredicatePrime ::= "THINK" | "KNOW" | "WANT" | "DON'T_WANT" | "FEEL" | "SEE" | "HEAR"
SpeechPredicatePrime ::= "SAY" | "WORDS" | "TRUE"
ActionEventMovementPredicatePrime ::= "DO" | "HAPPEN" | "MOVE"
ExistencePossessionPredicatePrime ::= "BE" | "THERE_IS" | "BE_SOMEONE" | "BE_SOMETHING" | "IS_MINE"
LifeDeathPredicatePrime ::= "LIVE" | "DIE"
TimePredicatePrime ::= "WHEN" | "TIME" | "NOW" | "BEFORE" | "AFTER" | "A_LONG_TIME" | "A_SHORT_TIME" | "FOR_SOME_TIME" | "MOMENT"
SpacePredicatePrime ::= "WHERE" | "PLACE" | "HERE" | "ABOVE" | "BELOW" | "FAR" | "NEAR" | "SIDE" | "INSIDE" | "TOUCH"
LogicalConceptPrime ::= "NOT" | "MAYBE" | "CAN" | "BECAUSE" | "IF"
IntensifierAugmentorPrime ::= "VERY" | "MORE"
SimilarityPrime ::= "LIKE" | "AS" | "WAY"

/* Questions */
Question ::= Question_Word SimpleClause
Question_Word ::= "WHERE" | "HOW" | "WHY" | "WHAT"

/* Negations */
Negation ::= "NOT" (SubstantivePrime | Molecule)

/* Molecules */
Molecule ::= (SubstantivePrime | Auxiliary_Word) {SubstantivePrime | Auxiliary_Word}
Auxiliary_Word ::= "AND"

/*
This grammar provides a way to construct sentences in the NSM framework. It includes the categories of primes and how they combine to create more complex expressions.
*/

```

This EBNF representation is more formal and can be used to create a parser for NSM expressions.
This grammar though, we need to convert it to a TextMate grammar, which is a format that VSCode can understand. If curious, the TextMate grammar file is located in the `src/grammars/nsm_grammar.tmLanguage.json` file. We're not including it here because it's quite long and not very readable.

## Parser

Next, we need to write a parser that can process input sentences based on the defined grammar rules. There are several parsing algorithms available, such as Earley, CYK, or GLR, that can handle different types of grammars. Depending on the complexity of our grammar and the desired efficiency, we can choose the most suitable algorithm.

4. Check for errors and provide feedback: Once the parser processes an input sentence, it can identify any violations of the grammar rules or the use of disallowed words. The program can then provide feedback to the user, indicating which part of the sentence is problematic and suggesting how to correct it.

Here's a high-level outline of a possible Python program using the NLTK library, which provides tools for natural language processing, including grammar definition and parsing:

Also, keep in mind that this exercise is focused on creating a syntax based on NSM primes and not an inherent part of the NSM theory itself. The primary goal of NSM is to find a set of semantic primitives that can be used to describe the meaning of more complex expressions in any language.

1. Implement a parser using a suitable parsing algorithm to process input sentences based on the grammar rules.
1. Develop the plugin to detect errors and provide feedback to the user on violations of grammar rules or the use of disallowed words.
1. Extend the vocabulary and grammar rules to include language-specific molecules.
1. Implement multilingual support by allowing users to define language-specific settings and molecule definitions in the configuration files.
1. Integrate the plugin with the VSCode IntelliSense system to provide autocompletion suggestions for NSM primes, molecules, and auxiliary words.
1. Include a built-in documentation viewer that provides users with quick access to NSM concepts, syntax rules, and language-specific information.
1. Test the plugin with various NSM text files and languages to ensure proper functionality and error detection.
1. Package the plugin for distribution and installation in VSCode.

## Tools and Libraries

- Python for plugin development
- Language Server Protocol (LSP) for integration with VSCode
- Parsing libraries, such as Lark or NLTK, for implementing the parser
- VSCode extension API for creating the plugin and integrating with the editor

## Future Extensions

- Support for additional languages and cultures
- Integration with other editors or IDEs
- Advanced features, such as syntax-aware search, navigation, and refactoring tools

This tech-spec provides an overview of the project, its requirements, implementation steps, tools and libraries, and possible future extensions. It can serve as a starting point for the development of the NSM syntax support plugin for VSCode.
