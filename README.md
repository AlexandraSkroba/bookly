# Bookly

## LAUNCH DEVELOPMENT ENVIRONMENT

- clone git repository
- open terminal and move cloned repository directory(`cd <directory>`)

## Contributing

### When you are working on jira tickets:

1. If you are working on jira ticket, then move it from `TO DO` to `In progress` status
2. Create new branch based on `master`. Please see `Naming convention for branches` section
3. Develop code locally and make commits. Please see `Naming convention for commits` section
4. Push your local branch into remote repository
5. Open pull request(PR). Please see `Naming convention for pull requests` section
6. If you completed working on PR, then move jira ticket to `Code Review`.
7. If someone left comments in PR, then if ticket is in `Code Review` status, then he/she should move ticket to `Respond to Review`
8. When PR author solved all comments(made changes in code or replied to comments), then he should move ticket to `Code Review`
9. Once the PR is approved, move the ticket to Done, merge the branch into develop, then merge develop into main and push the code to production.

#### Naming convention for branches

1. If related PR should be related to single jira ticket(or epic), then branch name shoult be the same. For example, `BK-1234`(uppercase project prefix, then dash, then ticket number)
2. Else if related PR should be related to multiple jira tickets, then branch name should contain all ticket numbers. For example, `BK-1234_BK-1235_BK-1236`(the same as single-ticket branch but multiple ones joined by underscore) is related to three tickets

#### Naming convention for commits

Regular commit name should have the following pattern:
`{TICKET_NUMBERS}: Made something`

1. `{TICKET_NUMBERS}` - is list of jira tickets this commit is related to. In most cases it's single ticket, but if multiple, then ticket numbers joined by `, `(comma and space)
2. Recommended: Usually commit name should start with upper case letter
3. Have some meaningful name

If your commit does multiple things, you can describe them in commit description as unordered list.
Sample commit names:

- `BK-1234: My commit name`
- `BK-1234, BK-1235: My commit related to both tickets`

#### Naming convention for pull requests

Regular PR title should have the following pattern:
`{TICKET_NUMBERS}: Made something`

1. `{TICKET_NUMBERS}` - is list of jira tickets this PR is related to. In most cases it's single ticket, but if multiple, then ticket numbers joined by `, `(comma and space)
2. Usually PR title should start with upper case letter
3. Have some meaningful name

Optionally you can add description for PR.
If PR is not ready(when you just published some preview) and you plan to work in it, then mark its title with `WIP: `(with space in the end) prefix.
If PR is ready for code review, then remove `WIP: ` prefix.

## Merge strategy

In this project, we will use squash-and-merge as the default strategy for merging pull requests.

### How to apply squash-and-merge:

- After the pull request is approved, you can select squash-and-merge in the pull request interface (typically on GitHub, Bitbucket, or GitLab).
  All commits from the feature branch will be combined into a single commit.
- You should write a clear and concise commit message summarizing the work done.
