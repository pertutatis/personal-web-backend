import { ArticleContent } from '../../ArticleContent'

export class ArticleContentMother {
  static create(
    value: string = `
    Clean code is not just about making the code work. It's about making the code easy to read, understand, and maintain. Here are some key principles:

    1. Keep Functions Small
    - Functions should do one thing
    - They should do it well
    - They should do it only

    2. Meaningful Names
    - Use intention-revealing names
    - Avoid disinformation
    - Make meaningful distinctions

    3. Comments
    - Comments do not make up for bad code
    - Explain your intentions
    - Clarify non-obvious code

    Read more about these principles in Clean Code by Robert C. Martin.
  `.trim(),
  ): ArticleContent {
    return new ArticleContent(value)
  }

  static random(): ArticleContent {
    const intros = [
      "In this comprehensive guide, we'll explore",
      "Let's dive deep into understanding",
      "Today, we're going to learn about",
      'A detailed analysis of',
      'Everything you need to know about',
    ]

    const topics = [
      'software design patterns',
      'clean code principles',
      'testing methodologies',
      'architectural decisions',
      'code refactoring techniques',
    ]

    const mainPoints = [
      'First, we need to understand the basic concepts',
      'The key principles to remember are',
      'Here are the most important aspects',
      "Let's break down the main components",
      'Consider these fundamental guidelines',
    ]

    const randomIntro = intros[Math.floor(Math.random() * intros.length)]
    const randomTopic = topics[Math.floor(Math.random() * topics.length)]
    const randomPoint =
      mainPoints[Math.floor(Math.random() * mainPoints.length)]

    return new ArticleContent(
      `
      ${randomIntro} ${randomTopic}.

      ${randomPoint}:

      1. Keep your code clean and maintainable
      2. Follow established best practices
      3. Write comprehensive tests
      4. Document important decisions
      5. Review and refactor regularly

      Remember that good code is not just about making it work, but making it maintainable and understandable for the long term.
    `.trim(),
    )
  }

  static tooLong(): ArticleContent {
    return new ArticleContent('a'.repeat(20001))
  }

  static maxLength(): ArticleContent {
    return new ArticleContent('a'.repeat(10000))
  }

  static empty(): ArticleContent {
    return new ArticleContent('')
  }

  static withSpacesOnly(): ArticleContent {
    return new ArticleContent('   ')
  }

  static withWhitespace(): ArticleContent {
    return new ArticleContent('  Content with spaces  ')
  }

  static fromValue(value: string): ArticleContent {
    return new ArticleContent(value)
  }
}
