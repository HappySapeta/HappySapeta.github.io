# Anupam Sahu's Portfolio

[View Portfolio Site](https://happysapeta.github.io)

## Adding projects

Project content lives in `assets/data/projects.json`. Add a project by duplicating an object in the array and updating these fields:

- `id`: unique lowercase identifier, such as `my-game`
- `category`: either `professional` or `personal`
- `title`: project name
- `studios`: a list of studios or collaborators
- `role`: a short description of your contribution
- `techStack`: a list of technologies used, such as `["Unreal Engine", "C++"]`; an empty or omitted list displays "To be added."
- `url`: optional public project URL; omit it or leave it empty to hide the link
- `cover`: path to the cover image
- `coverAlt`: short accessible description of the cover

Store cover images in `assets/images/`. The site automatically places each project in the correct scrollable list and uses the same information in its detail panel.
