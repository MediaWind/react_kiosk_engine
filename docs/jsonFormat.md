# JSON format

## Description

This documentation will explain in detail the different properties of a kiosk flow route JSON config.

## Table of content

- [Description](#description)
- [Table of content](#table-of-content)
- [Route level](#route-level)
	- [name](#name)
	- [i18n](#i18n)
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
		- [Action types](#action-types)
		- [Advanced button configuration](#advanced-button-configuration)
		- [Text input configuration](#text-input-configuration)
		- [Select configuration](#select-configuration)
	- [Input area media](#input-area-media)
- [Template](#template)

## Route level

These are the properties found on the route level, the root of the JSON structure.

```json
{
	"name": "The name of the route",
	"i18n": {},
	"scheduling": {},
	"flows": [{}],
	"errorManagement": {}
}
```

### name

This is the name of the route.

### i18n

This is the language contextualization of the route.

```json
"i18n": {
	"country": "be",
	"defaultLanguage": "fr",
	"languages": ["fr", "nl", "en", "es"]
},
```

It is defined by a required `country`, following the [ISO 3166-1 alpha-2 convention](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) in lower case. This is set up to be able to have dynamic public holidays. For now, only Belgium and France's public holidays are supported, so `country` should always be `"be"` or `"fr"`.

It is also defined by a required `defaultLanguage`, defining which fallback language should be used. The default is French.

Finally, a list of `languages` to declare which languages are used in the route. The languages follow the [ISO 639-1 convention](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes).

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

`scheduling` have 8 required keys: one for each day of the week + a `publicHolidays` key.

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
		"fr|nl|en|es": "optional path"
	},
	"noPaper": {},
	"notConnectedToInternet": {},
	"serviceClosed": {
		"default": {},
		"10": {}
	},
	"eIdTimeout": {},
	"unknownCard": {},
	"unresponsiveCard": {},
	"unreadableCard": {},
	"serviceQuotaLimitExceeded": {
		"default": {},
		"10": {}
	},

	"eIdInserted": {},
	"eIdRead": {}
}
```

The `errorManagement` object have keys associated with a type of error that will display an image on this error. Each key is defined by an object with the required `default` key, indicating the path to the default image for this error, and optional language keys, following the same [ISO 639-1 convention](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) as in the [i18n](#i18n) language declaration, pointing to a language adapted image path.

The `genericError` key is the only one required if an `errorManagement` is created. This is the fallback image for unsupported error types.

`noPaper` will display images when the printer has no more paper.

`notConnectedToInternet` will display images when the kiosk is not connected to internet.

`serviceClosed` has a different structure. Instead of going directly to the images paths, we must define a required `default` key that will hold the overall images when a service is closed, and we can also use a service id as a key to display a service closed error for a specific service. This allows displaying a schedule for that particular service, for example. Make sure the service id is the *production* service id, associated with the right EasyQueue module.

`eIdTimeout` will display images when the card reader takes more than 15 seconds to read the card.

`unknownCard` will display images when an invalid card is inserted. This is were you can suggest to end users to make sure they are using a valid Belgian eId card.

`unresponsiveCard` will display images when a card is inserted incorrectly or the chip is damaged. This is were you can suggest to end users to make sure they have inserted their card chip up.

`unreadableCard` will display images when a card has been inserted and read, but eId data is null.

`serviceQuotaLimitExceeded`, like `serviceClosed`, can be specific to one or more services. It will display a `default` image for all services or a unique image based on the *production* service id. This image will be displayed when we exceeded the service's tickets quota limit if there is one set up on the module.

`eIdInserted` is **not** an error per say. It will display images for when a card is inserted in the card reader, usually informing the end user that the card is currently being read and inviting them to not remove their card from the terminal.

`eIdRead` is **not** an error per say. It will display images for when the card is read and the end user can remove their card from the terminal. This serves as a block that cannot be discarted until the card is removed. This was implemented to make sure no card is left behind by end users when using the kiosk.

<ins style="color: green;">**Note:**</ins> This property might need some refactoring in the future, maybe need more error diversity to be able to cover all types of error. The `eIdInserted` and `eIdRead` properties are obviously not errors, so the whole property could use at least a renaming, and eventually a more complex structure to cover all UX needs.

## eventManagement
This optional property allows you to define actions to be executed when a specific event is triggered.

```json
"eventManagement" :{
		"eIdRead" : {
			"id" : "eIdRead",
			"name": "eIdRead",
			"backgroundImage": {
				"default": "{widget_folder}/img/remove-eid.png"
			},
			"zIndex": 900,
			"medias": [
				{
					"type": "image",
					"content": {
						"name": "test",
						"src": "{widget_folder}/img/out-id-card.gif",
						"styles": {
							"top": "29%",
							"left": "68%",

							"width": "20%",
							"height": "50%"
						}
					}
				}
			],
			"actions": [
				{
					"type": "POST",
					"endpoint": "http://localhost:8080/eid?id_project={W_ID_PROJECT}",
					"headers": {
						"Content-Type": "application/json",
					},
					"body": {
						"firstName": "firstnames",
						"lastName": "surname",
						"addressStreetAndNumber": "address_street_and_number",
						"addressZip": "address_zip",
						"addressMunicipality": "address_municipality",
						"dateOfBirth": "date_of_birth",
						"locationOfBirth": "location_of_birth",
						"nationalNumber": "national_number",
						"nationality": "nationality",
						"gender": "gender",
						"cardNumber": "card_number",
						"validityBeginDate": "validity_begin_date",
						"validityEndDate": "validity_end_date",
						"issuingMunicipality": "issuing_municipality",
						"firstLetterOfThirdGivenName": "first_letter_of_third_given_name",
						"specialStatus": "special_status"
					}
				}
			]
		}
	},
```

The `eIdRead` property can function similarly to a page but with an array og actions (optional). These actions and the specified page will be executed whenever the `EidData` changes.

You can use project variables by enclosing them in {} in the endpoint. These variables will be replaced by their respective values at runtime.
In the body, the keys are the readData we want to retrieve and the values are the key names we want to pass to the query body.

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

This is a UUID (or any other id as long as it's unique) used to link a flow to a [sheduling item](#scheduling).

### name

This is the name of the flow.

### homePage

This is the UUID of the home page. This is the start of your flow and allows the possibility to easily go back to the home page of the flow.

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

Each key here is optional and are used to specify which information is required for the ticket. The keys represent the parameters available at ticket creation and are associated with an `id` pointing to the text input responsible for this parameter. More on that [here](#text-input-configuration).

### keyboard

This is an optional property defining the configuration of the keyboard displaying on a page with text inputs. It allows full control over the customization of the keyboard.

Here is a simplified representation of the keyboard configuration.

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

The `layout` property is required. You can use layouts that are already implemented:
- `classic`: first row are special characters and numbers, the three following rows are letters, finally the last row are actions such as shift/capslock, switch between special characters and numbers, the spacebar, enter and delete.
- `compact`: first row are special characters and numbers, the two following rows are letters, finally the last row are actions described in the `classic` layout.
- `numpad`: classic keyboard numpad, four rows of numbers with the last row including enter, 0 and delete keys.
- `full`: layout imitating an actual keyboard, divided in two zones. First zone is similar to the `classic` layout, only the first row doesn't have numbers and switches between special characters and accentuated letters. Second zone is similar to the `numpad` layout.
- `custom`: provide your own custom layout in the `customLayout` property.

*Note that the special characters rows depends on the keyboard mode.*

The `mode` property is optional and enable switching between azerty or qwerty layouts. Defaults to `"azerty"`.

The `slideAnimation` property is optional and specifies the animation used to display or hide the keyboard. If no `slideAnimation` is provided, it will be determined by the keyboard position. More on that in the keyboard configuration documentation.

Possible animations are:

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

**For a more detailed explantation on how to configure your keyboard, check the [keyboard config documentation](keyboardConfig.md)**

### displayDate

This optional property can be used to display the date on the flow.

```json
"displayDate": {
	"format": "DD MMMM YYYY",
	"style": {}
}
```

It is defined by a `format` following the ISO 8601 standard and a `style` containing CSS properties.

The date will be displayed on every page of the flow in its specified zone.

### displayTime

This optional property can be used to display the time on the flow.

```json
"displayTime": {
	"format": "HH:mm:ss",
	"style": {}
}
```

It is defined by a `format` following the ISO 8601 standard and a `style` containing CSS properties.

The time will be displayed on every page of the flow in its specified zone.

**For more info on the date and time formats, visit the [dayjs documentation](https://day.js.org/docs/en/display/format)**.

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
			"fr|nl|en|es": "optional path"
		},

		"navigateToAfter": {
			"navigateTo": "UUID",
			"delay": 5,
			"printTicket": true,
			"service": {
				"serviceId": 1,
				"serviceFlowId": 2,
				"devServiceId": 10,
				"devServiceFlowId": 11,
				"priority": 0
			}
		},

		"displayDate": {},
		"displayTime": {},

		"medias": [{}],
		"zIndex": 999
	}
]
```

### id

This is the id of the page, which allows to navigate through the flow.

### name

This is the name of the page.

### backgroundImage

This is the background image to be displayed.

It is defined by a required `default` property pointing to the route of the associated image and optional language keys, following the same [ISO 639-1 convention](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) as in the [i18n](#i18n) language declaration, pointing to a language specific image's path that will adapt to the current language.

### navigateToAfter

This optional property is used to navigate to the next page without user interaction.

This property is defined by a required `navigateTo` key, pointing to the id of the next page, and a required `delay` property, with the number of seconds during which we display the page before switching to the next.

`printTicket` is optional and allows to trigger the printing of a ticket **after** waiting `delay` seconds. The associated `service` property is used to save the service informations for the ticket creation.

<ins>**Note:**</ins> This property is currently the subject of a discussion for refactoring and improvement. See issues #4 and #27 for more information.

### displayDate

Same principle as [displayDate](#displaydate) on the flow level, but specific to the page where it is declared. This will override the flow level's displayDate.

### displayTime

Same principle as [displayTime](#displaytime) on the flow level, but specific to the page where it is declared. This will override the flow level's displayTime.

### medias

An optional property listing all the medias of the page. More info in the [Media level](#media-level) section.

### zIndex
Add an optionall property to addd a zIndex on the page.


## Media level

This is a list of the different medias of the page that will be displayed above the background image.

```json
"medias": [
	{
		"type": "input",
		"content": {}
	}
]
```

A `media` is defined by its `type` and the associated `content`.

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

<hr />

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

<hr />

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

- `button`: a basic button, usually with a transparent background, to be placed above a "fake" button on the background image.
- `advancedButton`: a more complex button, associated with an `advancedButtonConfig`.
- `number`: a basic number input. This has never been used before, so it will be perfected when needed.
- `text`: a text input, associated with a `textInputConfig`.
- `select`: a select input, associated with a `selectConfig`.
- `scanner`: this input specifies that the page is ready to read and process informations from the kiosk scanner.
- `cardReader`: this input specifies that the page is ready to read and process informations from the kiosk card reader.

`actions` is a list of [actions](#action-types) triggered by interacting with the input.

`advancedButtonConfig` is the [configaration](#advanced-button-configuration) associated with the `advancedButton` type input.

`textInputConfig` is the [configaration](#text-input-configuration) associated with the `text` type input.

`selectConfig` is the [configaration](#select-configuration) associated with the `select` type input.

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
			"serviceID": 1,
			"serviceFlowId": 2,
			"devServiceId": 10,
			"devServiceFlowId": 11,
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
		"type": "custom",
		"id": "UUID"
	},
	{
		"type": "resetcustompage"
	},
	{
		"type": "getappointments",
		"params": {
			"nationalNumber" : true,
			"birthDate" : true, // TODO
			"services": [12, 15],
			"minBeforeAppointment" : 60,
			"minAfterAppointment" : 120
		}
	},
	{
		"type": "condition",
		"onSuccess": [
			{
				"type": "nextpage",
				"navigateTo": "e34eee63-7671-4862-ba6a-528956d72709"
			}, ...
		],
		"onFailure": [
			{
				"type": "nextpage",
				"navigateTo": "e34eee63-7671-4862-ba6a-528956d72709"
			}, ...
		],
		"conditions": {
			"&&": [
				{
					"==": [
						"appointmentsLength",
						1
					]
				},
				{
					">": [
						5,
						4
					]
				}
			]
		}
	}
]
```

An `action` is always defined by its `type`. Here is a break down of each type:

- `nextpage` must be associated to the `navigateTo` property. This indicates to the router that we are moving to the next page, referenced by its id.
- `previouspage` indicates to the router that we are going back to the previous page.
- `homepage` indicates to the router that we are going back to the home page. Anytime we go back to the home page, the router and all saved data are reset.
- `saveservice` saves the service id selected. It must be associated with the `service` object.
	- This object have an optional `serviceId`, representing the <ins>production</ins> service id in the prod EasyQueue module instance. This is the one that will be saved during production. The value can be a dynamic variable create in the `Variables.ts`. Example: 
	```json
	{
		"type": "saveservice",
		"service": {
			"serviceID": "{W_ID_SERVICE_PRINT}",
			"devServiceId": "{W_ID_SERVICE_PRINT}",
			"priority": 0
		}
	},
	```

	- An optional `serviceFlowId`, representing the <ins>production</ins> service flow id in the prod EasyQueue module instance. This is the one that will be saved during production. The `serviceFlowId` (and the following `devServiceFlowId`) is used for step/stage tickets.
	- An optional `devServiceId`, representing the <ins>development</ins> service id in the dev EasyQueue module instance. This is the one that will be saved during development. This was added so the serviceId doesn't need to be adjusted when switching between dev and prod, reducing potential inattention errors.
	- An optional `devServiceFlowId`, representing the <ins>development</ins> service flow id in the dev EasyQueue module instance.
	- An optional `priority`. It can be 1 for `normal` (default), 2 for `high` or 3 for `urgent`.
- `createticket` sends a request for creating the ticket. To be able to create a ticket, a service id must first be saved.
- `printticket` sends a request for printing the ticket. To be able to print a ticket, it must be created first. Once the ticket is created and the print is requested, the actual printing is triggered.
- `changelanguage` must be associated to the `language` property. Switches the current language of the flow globally.
- `checkin`, usually attached to the `scanner` input, will signify that the page is ready to use the qr code read with the scanner and proceed to check it in the EasyQueue module.
- `checkout`, usually attached to the `scanner` input, will signify that the page is ready to use the qr code read with the scanner and proceed to check it out of the EasyQueue module.
- `checktextinputs` first verify that all required text inputs on the page are filled before proceeding to the rest of the actions.
- `custom` triggers a custom action. For more informations, refer to the [custom action documentation](customAction.md).
- `resetcustompage` sets the custom page to undefined.
- `getappointments` retrieves a person's appointments based on their national number, birth date, or specified services. You can set `minBeforeAppointment` and `minAfterAppointment` to filter appointments within a specific time range relative to the current date. Warning, actions are asynchronous so maybe verify that appointmentsState is already set before using it.
- `condition` action allows you to perform other actions based on the result of specific conditions. For example, you can create custom functions like appointmentsLength inside a conditionsHandler function and pass it to the engine using the onConditions prop (e.g., onConditions={conditionsHandler}). These custom functions can then be used in the condition action by referencing the name defined in conditionsHandler, as shown in the example below.

```ts
export function conditionsHandler(supercontext: SuperContext) {
	async function checkAppointment() {
		return true
	}

	function appointmentsLength() {
		console.log("appointmentsLength");
		const getAppointments = supercontext.hooks.useAppointment[3];
		const appointments = getAppointments();

		if (appointments && appointments.length > 0) {
			return true;
		} else {
			return false;
		}
	}

	const runConditionFunction: { [key: string]: () => any } = {
		"appointmentsLength": appointmentsLength,
		"checkAppointment": checkAppointment,
	};

	return runConditionFunction;
}
```

#### Advanced button configuration

```json
{
	"type": "input",
	"content": {
		"name": "name",
		"type": "advancedButton",
		"actions": [],
		"styles": {},

		"advancedButtonConfig": {
			"backgroundImage": {
				"default": "path",
				"fr": "path"
			},
			"label": {
				"fr": "label"
			},

			"pressed": {
				"backgroundImage": {
				"default": "path",
				"fr": "path"
			},
				"label": {
					"fr": "label"
				},
				"animation": "moveDown",
				"style":  {}
			}
		}
	}
}
```

The `advancedButtonConfig` is always paired with an `advancedButton` input.

Unlike the basic `button` input, you can use this to add an *actual* button above your page's background image, instead of having a clickable div that is placed above a "fake" button on the background image.

Each property in the `advancedButtonConfig` is optional.

`backgroundImage` follows the same structure as a page's [background image](#backgroundimage). It is used to add an image to your button and have it depend on the current language.

`label` is used to manually add a label to your button. Use languages as keys to adapt it to the current language.

`pressed` contains the properties associated when the button is pressed:

- `backgroundImage` follows the convention used above. Use this if you want a different background image when you press the button.
- `label` follows the convention used above. Use this if you want a different label when you press the button.
- `animation` can be used to add an animation when you press the button.
	- `moveDown`: the button moves down on click/touch down and up on click/touch up.
	- `embossed`: the button is seemingly embossed into the page's background on click/touch down and goes back to its original position on click/touch up.
	- `flip`: the button flips forward when clicked/touched.
	- `shine`: a shine effect goes accross the button when clicked/touched.
	- `roll`: the button rotates clockwise when clicked/touched.
	- `bounce`: the button moves down on click/touch down and bounces like a spring on click/touch up. A shadow is added to amplify the bouncy effect.
- `style` are the styles you want to apply when the button is pressed.


**<ins>Notes about the styling:</ins>**

- `styles` outside of the `advancedButtonConfig` is the default style of the button.
- `style` inside the `pressed` property of the `advancedButtonConfig` is additionnal or overriding styles to the above `styles`, applied when the button is pressed.
- The `label` styles only takes `fontFamily`, `fontSize`, `color` and `textAlign` attributes. Define those in the `input`'s `styles` or in the `advancedButtonConfig`'s `pressed`'s `style`.

#### Text input configuration

```json
{
	"type": "input",
	"content": {
		"name": "string",
		"type": "text",
		"styles": {},

		"textInputConfig": {
			"textInput": {
				"id": "id associated with the flow's ticketParameters",
				"value": "value - usually left empty",
				"required": false
			},
			"placeholder": {
				"fr": "placeholder"
			},
			"autoFocus": true,
			"textPreview": false,
			"forceLowerCase": false,
			"forceUpperCase": true
		}
	}
}
```

The `textInputConfig` is always paired with a `text` input. Note that each `textInputConfig` is specific to *one* `text` input and not all of them if you have multiple `text` inputs on your page.

`textInput` holds the informations of the input itself. `id` is the id used to link it to the [`ticketParameters`](#ticketparameters). `value` is the value of the input, usually left empty when defined in the JSON. It will be updated whenever we write into the input. `required` is optional and indicates whether the inputs needs to be filled.

`placeholder` is the optional placeholder of your input. Use language codes as keys to adapt your input depending on the language. It disappears as soon as you start typing in your input.

`autoFocus` is optional and defines the input that is focused when you first land on the page. Note that the keyboard displays and hides depending on wheter a `text` input is focused or not.

`textPreview` is optional and enables a window inside the keyboard above the keys to preview the value inside the `text` input. It is usually used when your keyboard covers the focused input of a page.

`forceLowerCase` is optional and forces the keyboard to start and stay in lower case. You can still manually switch to upper case with the shift/capslock key. It is for example used when the input receives an email address.

`forceUpperCase` is optional and forces the keyboard to start and stay in upper case. You can still manually switch to lower case with the shift/capslock key. It is for example used when the input receives a license plate.

*Note: `actions` are not used in a text input.*

#### Select configuration

```json
{
	"type": "input",
	"content": {
		"name": "string",
		"type": "select",
		"styles": {},

		"selectConfig": {
			"provider": "services",
			"placeholders": {
				"fr": "placeholder"
			},
			"options": [
				{
					"key": "option id",
					"label": "option label",
					"value": "option value"
				}
			],
			"dropdownStyles": {},
			"optionStyles": {},
			"filterUnavailable": false,
			"filterIds": [""]
		}
	}
}
```

The `selectConfig` is always paired with a `select` input.

The `provider` indicates where the select fetches its content. It can be `services`, `userAgents` or `custom`.

`placeholders` are optional and add a custom default text to your input. Use language codes as keys to adapt to the current language. Note that if no `placeholders` is defined, a select will still have a default text, adapting to the language. Use this if you need a specific default value to your select.

`options` is optional and used paired with a custom `provider`. Enter your options with a `key`, used to map your options, a `label` to be displayed and a `value` to be saved.

`dropdownStyles` is optional and contains the CSS properties of the dropdown.

`optionStyles` is optional and contains the CSS properties of the options.

`filterUnavailable` is optional and is used to hide the `services` or `userAgents` that are currently closed or not connected.

`filterIds` is optional and is an array of specific `service` ids that you want to be displayed.

**<ins>Note about the styling:</ins>**

- `styles` outside of the `selectConfig` defines the styling of the input.
- `dropdownStyles` inside of the `selectConfig` defines the styling of the dropdown shown when you click on the input.
- `optionStyles` inside of the `selectConfig` defines the styling of the options inside of your dropdown.

*Note: `actions` are not used in a select input.*

<hr />

### Input area media

This media defines an area containing a list of dynamically created inputs.

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

An `inputArea` medias's content is defined by a `name`, `styles` containing CSS properties and a `provider`. These providers fetch the informations required to automatically spawn the inputs. `services` will fetch the services, `userAgents` will fetch the agents, both defined in the EasyQueue module. `custom` is currently not supported but when there's a need for it, we could manually define the inputs generated in the inputs area.

The `content` can also contain optional [`actions`](#action-types) that will follow the structure of a regular input's `actions` property, `filterUnavailable` that will be passed to the `services` or `userAgents` provider to hide services/agents that are currently closed or not connected, `filterIds` that will be passed to the `services` provider to manually select the ids of the services we want to display and an `inputsConfig`.

The `inputsConfig` is defined by a `type` following the [input types](#input-media) convention and `styles` containing CSS properties that will be applied on each input.

<ins>**Note:**</ins> This is currently one of the newest feature and it will definitely require some reworking as needs become more precise and diverse.

## Template

A route template is provided in the root directory of the `Engine` to help you construct your route under the name [`route_template.json`](../route_template.json).

It is not required but recommended to store your widget's routes in a `routes` folder in your widget's directory. Don't forget to import them in your widget's `App` and feed the selected one to the `Engine` component.
