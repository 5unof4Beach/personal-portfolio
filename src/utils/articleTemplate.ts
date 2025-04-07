const defaultTemplate = `
<div style="display: flex; align-items: center; margin-bottom: 20px;">
  <img src="https://avatars.githubusercontent.com/5unof4Beach" alt="Duc Bui" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 15px;" />
  <div>
    <a href="https://github.com/5unof4Beach" style="color: gray; text-decoration: none; font-weight: bold;">Duc Bui</a>
    <div style="color: #666; font-size: 0.9em; font-weight:500">Developer</div>
  </div>
</div>

# Introduction

Write your introduction here...

## Main Content

Your main content goes here...

### Subsection

- Point 1
- Point 2
- Point 3

## Code Examples

\`\`\`typescript
// Your code example here
const example = "Hello World";
console.log(example);
\`\`\`

## Conclusion

Wrap up your article here...
`;

export function getArticleTemplate(): string {
  return defaultTemplate
}
