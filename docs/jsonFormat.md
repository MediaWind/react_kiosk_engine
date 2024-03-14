# JSON format

## Description

This documentation will explain in detail the different properties of a kiosk flow route JSON config.

## Table of content

- [Description](#description)
- [Table of content](#table-of-content)
- [Route level](#route-level)
	- [name](#name)
	- [languages](#languages)
	- [scheduling](#scheduling)
	- [flows](#flows)
	- [errorManagement](#errormanagement)
- [Flow level](#flow-level)
	- [id](#id)
	- [name](#name-1)
	- [homePage](#homepage)
	- [navigateToHomePageAfter](#navigatetohomepageafter)
	- [ticketParameters](#ticketparameters)
	- [keyboard](#keyboard)
	- [displayDate](#displaydate)
	- [displayTime](#displaytime)
	- [pages](#pages)
- [Page level](#page-level)
	- [id](#id-1)
	- [name](#name-2)
	- [backgroundImage](#backgroundimage)
	- [navigatoToAfter](#navigatetoafter)
	- [medias](#medias)
- [Media level](#media-level)
	- [Video media](#video-media)
	- [Image media](#image-media)
	- [Input media](#input-media)
	- [Input area media](#input-area-media)

## Route level

These are the properties found on the route level, the root of the JSON structure.

```json
{
	"name": "The name of the route",
	"languages": ["fr", "en", "nl"],
	"scheduling": {},
	"flows": [{}],
	"errorManagement": {}
}
```

### name

This is the name of the route.

### languages

This property is a list of languages used in the route. We expect this property to have at least one language defined.

<ins>To do:</ins> In the near future, we will have to add a `defaultLanguage` property to fall back on. Right now this default language is French, we want to be able to set that explicitly in the config JSON file.

### scheduling

This is the scheduling of the flows.

```json
"scheduling": {
	"monday": [
		{
			"id": "UUID",
			"startTime": "08:30"
		}
	],
	"tuesday": [],
	"wednesday": [],
	"thursday": [],
	"friday": [],
	"saturday": [],
	"sunday": [],
	"publicHolidays": [],
}
```

`scheduling` have 8 required keys: one for each day of the week + a `publicHoliday´ key.

These days items are defined by an array holding a list of schedule items, themselves defined by a required `id`, referencing to a flow, and an optional `startTime`, respecting the **"HH:mm"**, 24h format.

In practice, a single day item can hold multiple schedule items. The referenced flow will start at the `startTime` and keep going until the `startTime` of the next item is reached. If there is only one continuous flow on that day, we don't need to specify a `startTime`.

### flows

This is a list of all the flows associated with the route. More on that in the [Flow level](#flow-level) section.

### errorManagement

This is an optional property to display error specific custom images. If no `errorManagement` is specified, a default screen will be displaying the error messages.

```json
"errorManagement": {
	"genericError": {
		"default": "required path",
		"french": "optional path",
		"dutch": "optional path",
		"english": "optional path",
		"spanish": "optional path"
	},
	"noPaper": {},
	"notConnectedToInternet": {},
	"serviceClosed": {
		"default": {},
		"10": {}
	},
	"eIdTimeout": {},

	"eIdInserted": {},
	"eIdRead": {}
}
```

The `errorManagement` object have keys associated with a type of error that will display an image on this error. Each key is defined by an object with the required `default` key, indicating the path to the default image for this error, and the optional `french`, `dutch`, `english` or `spanish` keys pointing to a language adapted image path.

The `genericError` key is the only one required if an `errorManagement` is created. This is the fallback image for unsupported error types.

`noPaper` will display images when the printer has no more paper.

`notConnectedToInternet` will display images when the printer is not connected to internet.

`serviceClosed` has a different structure. Instead of going directly to the images paths, we must define a required `default` key that will hold the overall images when a service is closed, and we can also use a service id as a key to display a service closed error for a specific service. This allows displaying a schedule for that particular service, for example. Make sure the service id is the *production* service id, associated with the right EasyQueue module.

`eIdTimeout` will display images when the card reader takes more than 15 seconds to read the card.

`eIdInserted` is **not** an error per say. It will display images for when a card is inserted in the card reader, usually informing the end user that the card is currently being read and inviting them to not remove their card from the terminal.

`eIdRead` is **not** an error per say. It will display images for when the card is read and the end user can remove their card from the terminal. This serves as a block that cannot be discarted until the card is removed. This was implemented to make sure no card is left behind by end users when using the kiosk.

This property might need some refactoring in the future, maybe need more error diversity to be able to cover all types of error. The `eIdInserted` and `eIdRead` properties are obviously not error, so the whole property could use at least a renaming, and eventually a more complex structure to cover all UX needs.

## Flow level

These are the properties defining a flow object, found in the [route level](#route-level) under the `flows` property.

```json
"flows": [
	{
		"id": "UUID",
		"name": "name",

		"homePage": "UUID",
		"navigateToHomePageAfter": 30,

		"ticketParameters": {},

		"keyboard": {},

		"displayDate": {},
		"displayTime": {},

		"pages": [{}]
	}
]
```

### id

This is a UUID (or any other id as long as it's unique) used in a [sheduling item](#scheduling) to point to a flow.

### name

This is the name of the flow.

### homePage

This is the UUID of the home page. It allows the possibility to easily go back to the home page of the flow.

### navigateToHomePageAfter

This is an optional property with the number of seconds with no user interaction before the flow automatically resets itself and go back to the home page. If no `navigateToHomePageAfter` is specified, the flow will need the end user to manually go back to the home page.

### ticketParameters

This defines the parameters needed for the ticket

```json
"ticketParameters": {
	"firstname": "id",
	"lastname": "id",
	"nationalNumber": "id",
	"email": "id",
	"phone": "id",
	"company": "id",
	"comment": "id",
	"idUserAgent": "id"
}
```

Each key here is optional and are used to specify which information is required for the ticket. The key represent the parameters available at ticket creation and are associated with an `id` pointing to the text input responsible for this parameters. More on that here.
<!-- TODO: add link to the text input id mapping -->

### keyboard

This is an optional property defining the configuration of the keyboard displaying on a page with text inputs. It allows full control over the customization of the keyboard.

```json
"keyboard": {
	"layout": "classic",
	"mode": "azerty",
	"slideAnimation": "bottom",
	"customLayout": {},
	"actionsOverride": {},
	"styleOverride": {}
}
```

Here is a simplified representation of the keyboard configuration.

The `layout` property is required. You can use layouts that are already implemented:
- `classic`: first row are special characters and numbers, the three following rows are letters, finally the last row are actions such as shift/capslock, switch between special characters and numbers, the spacebar, enter and delete.
- `compact`: first row are special characters and numbers, the two following rows are letters, finally the last row are actions described in the `classic` layout.
- `numpad`: classic keyboard numpad, four rows of numbers with the last row including enter, 0 and delete keys.
- `full`: layout imitating an actual keyboard, divided in two zones. First zone is similar to the `classic` layout, only the first row doesn't have numbers and switches between special characters and accentuated letters. Second zone is similar to the `numpad` layout.
- `custom`: provide your own custom layout in the `customLayout` property.

*Note that the special characters rows depends on the keyboard mode.*

The `mode` property is optional and enable switching between azerty or qwerty layouts. Defaults to `"azerty"`.

The `slideAnimation` property is optional and specifies the animation used to display or hide the keyboard. If no `slideAnimation` is provided, it will be determined by the keyboard position. More on that in the keyboard doc. Possible animations are:
- `top`: Keyboard appears from the center top of the screen.
- `right`: Keyboard appears from the center right of the screen.
- `left`: Keyboard appears from the center left of the screen.
- `bottom`: **Default behavior.** Keyboard appears from the center bottom of the screen.
- `top_left`: Keyboard appears diagonally from the top left of the screen.
- `top_right`: Keyboard appears diagonally from the top right of the screen.
- `bottom_left`: Keyboard appears diagonally from the bottom left of the screen.
- `bottom_right`: Keyboard appears diagonally from the bottom right of the screen.

The `customLayout` is an optional property, associated with `"layout": "custom"`. This is where you provide your own keyboard layout. For a detailed explanation, see the keyboard configuration documentation.

The `actionsOverride` property is an optional property that allows you to use a provided keyboard layout but replace the action of a specific key. For a detailed explanation, see the keyboard configuration documentation.

The `styleOverride` property is an optional property that allows you to use a provided keyboard layout but replace the style of the board, the rows and/or the keys. For a detailed explanation, see the keyboard configuration documentation.

### displayDate

This optional property can be used to display the date on the flow.

```json
"displayDate": {
	"format": "DD MMMM YYYY",
	"style": {
		"all": "css properties"
	}
}
```

It is defined by a `format` following the ISO 8601 standard and a `style` containing CSS properties.

The date will be displayed on every page of the flow in its specified zone.

### displayTime

This optional property can be used to display the time on the flow.

```json
"displayTime": {
	"format": "HH:mm:ss",
	"style": {
		"all": "css properties"
	}
}
```

It is defined by a `format` following the ISO 8601 standard and a `style` containing CSS properties.

The date will be displayed on every page of the flow in its specified zone.

**For more info on the date and time formats, visit the [dayjs documentation](https://day.js.org/docs/en/display/format)**

### pages

This is a list of all the pages of the flow. More on that in the [Page level](#page-level) section.

## Page level

These are the properties defining a page object, found in the [flow level](#flow-level) under the `pages` property.

```json
"pages": [
	{
		"id": "UUID",
		"name": "name",

		"backgroundImage": {
			"default": "required path",
			"french": "optional path",
			"dutch": "optional path",
			"english": "optional path",
			"spanish": "optional path"
		},

		"navigateToAfter": {
			"navigateTo": "UUID",
			"delay": 5,
			"printTicket": true,
			"service": {
				"serviceId": 10,
				"devServiceId": 20,
				"priority": 0
			}
		},

		"medias": [{}]
	}
]
```

### id

This is the id of the page, which allows to navigate through the flow.

### name

This is the name of the page.

### backgroundImage

This is the background image to be displayed.

It is defined by a required `default` property pointing to the route of the associated image and the optional `french`, `dutch`, `english` or `spanish` properties pointing to a language specific image's path.

### navigateToAfter

This optional property is used to navigate to the next page without user interaction.

This property is defined by a required `navigateTo` key, pointing to the id of the next page, and a required `delay` property, with the number of seconds during which we display the page before switching to the next.

`printTicket` is optional and allows to trigger the printing of a ticket **after** waiting `delay` seconds. The associated `service` property is used to save the service informations for the ticket creation.

<ins>**Note:**</ins> This property is currently the subject of a discussion for refactoring and improvement. See issues #4 and #27 for more information.

### medias

An optional property listing all the medias of the page. More info in the [Media level](#media-level) section.

## Media level

This is a list of the different media of the page that will be displayed above the background image.

```json
"medias": [
	{
		"type": "input",
		"content": {}
	}
]
```

A `media` is defined by its `type` and the associated `content`

### Video media

This media allows to display a video on the page.

```json
{
	"type": "video",

	"content": {
		"name": "name",
		"src": "path",
		"type": "video/mp4",

		"controls": false,

		"styles": {}
	}
}
```

A `video` type media's content is defined by a `name`, a `src` pointing to the path of the video, a `type` following the [MIME convention](https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types), `controls` defining if we display the video controls or not, and `styles` containing CSS properties.

**<ins>Note:</ins>** This media has not been used previously and will need testing and refactoring when needed.

### Image media

This media allows to display an image on the page.

```json
{
	"type": "image",

	"content": {
		"name": "name",
		"src": "path",

		"animate": "rightToLeft|bottomToTop|topToBottm|leftToRight",

		"styles": {}
	}
}
```

An `image` type media's content is defined by a `name`, a `src` pointing to the path of the image, an `animate` allowing animation of said image and `styles` containing CSS properties.

**<ins>Note:</ins>** This media has not been used previously and will need testing and refactoring when needed.

### Input media

This complex media is the powerhouse of user interaction.

```json
{
	"type": "input",
	"content": {
		"name": "name",
		"type": "button",
		"styles": {},
		"actions": [],

		"advancedButtonConfig": {},
		"textInputConfig": {},
		"selectConfig": {}
	}
}
```

`name` defines the name of the input.

`type` defines the type of the input. It can be:

- `button`: a basic button, usually with a transparent background, to be placed above a button on the background image.
- `advancedButton`: a more complex button, associated with an `advancedButtonConfig`.
- `number`: a basic number input. This has never been used before, so it will be perfected when needed.
- `text`: a text input, associated with a `textInputConfig`.
- `select`: a select input with a dropdown of items, associated with a `selectConfig`.
- `scanner`: this input specifies that the page is ready to read and process the informations from the kiosk scanner.
- `cardReader`: this input specifies that the page is ready to read and process informations from the kiosk card reader.

`actions` is a list of actions triggered by interacting with the input.

`advancedButtonConfig` is the configaration associated with the `advancedButton` type input.

`textInputConfig` is the configaration associated with the `text` type input.

`selectConfig` is the configaration associated with the `select` type input.

#### Action types

Here are the different action types available and what they do.

```json
"actions": [
	{
		"type": "nextpage",
		"navigateTo": "page UUID"
	},
	{
		"type": "previouspage"
	},
	{
		"type": "homepage"
	},
	{
		"type": "saveservice",
		"service": {
			"serviceId": 1,
			"devServiceId": 2,
			"priority": 0
		}
	},
	{
		"type": "createticket"
	},
	{
		"type": "printticket"
	},
	{
		"type": "changelanguage",
		"language": "fr|nl|en|es"
	},
	{
		"type": "checkin"
	},
	{
		"type": "checkout"
	},
	{
		"type": "checktextinputs"
	},
	{
		"type": "custom"
	}
]
```

An `action` is always defined by its `type`. Here is a break down of each type:

- `nextpage` must be associated to the `navigateTo` property. This indicates to the router that we are moving to the next page, referenced by its id.
- `previouspage` indicates to the router that we are going back to the previous page.
- `homepage` indicates to the router that we are going back to the home page. Anytime we go back to the home page, the router and all saved data are reset.
- `saveservice` saves the service id selected. It must be associated with the `service` object.
	- This object have a required `serviceId`, representing the <ins>production</ins> service id in the prod EasyQueue module instance. This is the one that will be saved during production.
	- An optional `devServiceId`, representing the <ins>development</ins> service id in the dev EasyQueue module instance. This is the one that will be saved during development. This was added so the serviceId doesn't need to be adjusted when switching between dev and prod, reducing potential inattention errors.
	- An optional `priority`
- `createticket` triggers the ticket creation. To be able to create a ticket, a service id must first be saved.
- `printticket` sends a request for printing the ticket. To be able to print a ticket, it must be created first. Once the ticket is created and the print is requested, the actual printing is triggered.
- `changelanguage` must be associated to the `language` property. Switches the current language of the flow globally.
- `checkin`, usually attached to the `scanner` input, will signify that the page is ready to use the qr code read with the scanner and proceed to check it in in the EasyQueue module.
- `checkout`, usually attached to the `scanner` input, will signify that the page is ready to use the qr code read with the scanner and proceed to check it out in the EasyQueue module.
- `checktextinputs`, usually attached to the `text` input, first verify that all required text inputs are filled before proceeding to the rest of the actions.
- `custom` triggers a custom action. More on that in the [custom actions](#custom-actions) section.

#### Custom actions

If needed, a custom action can be introduced inside the flow. This custom action is defined *outside* of the Engine and entirely managed from the widget using the kiosk Engine.

To use a custom action, a `onCustomAction` prop needs to be passed to the `Engine` componant in the widget's `App`, pointing to a handler that will receive a supercontext containing all of the usefull tools inside the Engine.

In practice, this supercontext looks like this:

```ts
{
	router: {
		state,
		dispatcher
	},
	language: {
		state,
		dispatcher
	},
 	ticket: {
		state,
		dispatcher
	},
	print: {
		state,
		dispatcher
	},
	appointment: {
		state,
		dispatcher
	},
 	error: {
		state,
		dispatcher
	},
 	customPage: {
		state,
		dispatcher
	},
}
```

Each context is separated and provides a `state` and a `dispatcher` that operates in a specific way. Here is the break down of how to read and write these contexts:

```ts
router: {
	state: [{}],
	dispatcher: {
		nextPage,
		previousPage
		homePage,
	},
}
```

The router `state` is an array of all [pages](#page-level) the end user has navigated through. Call the `dispatcher`'s `

### Input area media

This media defines an area dynamically containing a list of inputs.

For now, it only supports advanced buttons, but in the future, it could be used to support all types of inputs.

```json
{
	"type": "inputArea",
	"content": {
		"name": "name",
		"provider": "services|userAgents|custom",
		"styles": {},

		"actions": [],
		"filterUnavailable": false,
		"filterIds": [""],
		"inputsConfig": {
			"type": "advancedButton",
			"styles": {}
		}
	}
}
```

An `inputArea` medias's content is defined by a `name`, `styles` containing CSS properties and a `provider`. These providers fetch the informations required to automatically spawn the inputs. `services` will fetch the services, `userAgents` will fetch the agents, both defined in the EasyQueue module. `custom` is currently not supported by when there's a need for it, we could manually define the inputs generated in the inputs area.

The `content` can also contain optional `actions` that will follow the structure of a regular input's `actions` property, `filterUnavailable` that will be passed to the `services` or `userAgents` provider to hide services/agents that are currently closed or not connected, `filterIds` that will be passed to the `services` provider to manually select the ids of the services we want to display and an `inputsConfig`.
<!-- TODO: add link to input actions -->

The `inputsConfig` is defined by a `type` following the input types convention and `styles` containing CSS properties that will be applied on each input.
<!-- TODO: add link to input types -->

<ins>**Note:**</ins> This is currently one of the newest feature and it will definitely require some reworking as needs become more precise and diverse.
