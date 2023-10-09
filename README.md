## Description
This is a submodule with the engine function used in all kiosk flow widgets

## Table of contents
- [Description](#description)
- [Table of contents](#table-of-contents)
- [Add this submodule to a widget](#add-this-submodule-to-a-widget)
- [Cloning a project with submodules](#cloning-a-project-with-submodules)
- [Updating your submodule in your widget](#updating-your-submodule-in-your-widget)
- [Working on the submodule](#working-on-the-submodule)
- [Interact with shared variable](#interact-with-shared-variable)

## Add this submodule to a widget
```bash
# run this command in the project root directory (next to the .git directory)
git submodule add git@github.com:MediaWind/react_kiosk_engine.git ./src/engine
```

## Cloning a project with submodules
```bash
git clone --recurse-submodules git@github.com:MediaWind/widget_funeral_public_generalist.git
# the important part in this command is the --recurse-submodules with it you can clone your repo and all it's submodules recursively
```

## Updating your submodule in your widget
```bash
git submodule update --remote src/engine
# this command is used when you want the widget to use the latest version of the engine
```

```bash
# if you just want to update your local version (ex: someone else as made an update with the command above)
git pull --recurse-submodules
```

## Working on the submodule
```bash
# To work on the engine you just need to clone the repo
git clone git@github.com:MediaWind/react_kiosk_engine.git
```

After that you commit and push like other project

Your modification won't directly impact your widget, you will need to update the engine on the widget for that refer to: [Updating your submodule in your widget](#updating-your-submodule-in-your-widget)
