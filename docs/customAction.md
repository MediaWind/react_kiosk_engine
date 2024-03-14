# Custom action

## Descritpion

This is a detailed documentation about the custom action of a flow. If you don't know what a flow is, start by reading the `jsonFormat.md` documentation.

## Table of contents

- [Description](#descritpion)
- [Table of contents](#table-of-contents)
- [Usage](#usage)
- [Supercontext breakdown](#supercontext-breakdown)

## Usage

A custom action is used to trigger an action that is not supported by the `Engine` and will never be. Example: you need to fetch informations from an external API.

Assuming your `Engine` component is in your widget's `App`:

1. In your route json, use an `input`'s `actions` property to trigger the custom action like so:

```json
{
	"type": "input",
	"content": {
		"name": "name",
		"type": "button",
		"actions": [
			{
				"type": "custom"
			}
		]
	}
}
```
When interacted with, the `input` will trigger the forwarding of a [supercontext](#supercontext-breakdown) to your widget's `App`.

2. In your `App`, make sure your `Engine` component points to a handler.

```ts
function App() {
	// Your App stuff here

	function customActionHandler() {
		// This is where the magic happens
	}

	return <Engine route={myImportedRoute} onCustomAction={customActionHandler} />;
}
```

If your forget to define a `onCustomAction` prop, don't worry, you will receive a warning in the console.

3. Collect the `supercontext` in your handler's parameters

```ts
function customActionHandler(supercontext) {
	...
}
```

4. Define here what your custom action does and how it interacts with the data inside of the `Engine` with the `supercontext`.

```ts
function customActionHandler(supercontext) {
	...
}
```

## Supercontext breakdown

*Note that the name `supercontext` is used in this documentation as a reference to an otherwise unnamed object.*

If needed, a custom action can be introduced inside the flow. This custom action is defined *outside* of the `Engine` and entirely managed from the widget using it.

To use a custom action, a `onCustomAction` prop needs to be passed to the `Engine` component in the widget's `App`, pointing to a handler that will receive a supercontext containing all of the usefull tools inside the Engine.

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

router.dispatcher.nextPage("id")
router.dispatcher.previousPage()
router.dispatcher.homePage()
```

The router `state` is an array of all [pages](#page-level) the end user has navigated through up to this point.

Call the `dispatcher`'s `nextPage` with a string containing the next page's `id` as a parameter.

Call the `dispatcher`'s `previousPage` to go back to the previous page. No parameter needed.

Call the `dispatcher`'s `homePage` to go back to the home page. No parameter needed.

```ts
language: {
	state: LANGUAGE.FRENCH,
	dispatcher,
}

language.dispatcher(LANGUAGE.DUTCH)
```

The language's `state` is the current language. It can be undefined.

Call `dispatcher` with a `LANGUAGE` or `undefined` as a parameter to define a new language.

```ts
ticket: {
	state: {
		eIdDatas: null,
		textInputDatas: [
			{
				id: "text_input_id",
				value: "",
				required: false
			}
		],
		service: {
			serviceId: 1
		},
		language: undefined,
	},
	dispatcher,
}

ticket.dispatcher({
	type: TICKET_DATA_ACTION_TYPE.SERVICEUPDATE,
	payload: {
		serviceId: 4,
		devServiceId: 10,
		priority: 0
	}
})
```

The ticket's `state` is an object containing the usefull informations for ticket creation:

- `eIdDatas` are the saved data from a read eId. It can be `null`.
- `textInputDatas` is an array of text input fields. The `id` is the link between [`ticketParameters`](#ticketparameters) and text inputs. `value` is the current value of the text input. `required` is optional and defines if the text input is required to be filled.
- `service` is the currently saved service. It can be `undefined`.
- `language` is the current language.

Call the `dispatcher` with a `ITicketDataAction` object as a parameter. Refer to the `ticketDataReducer` for more informations.

```ts
print: {
	state: {
		ticketPDF: null,
		ticketCreationRequested: false,
		printRequested: false,
	},
	dispatcher
}

ticket.dispatcher({
	type: PRINT_ACTION_TYPE.REQUESTPRINT,
	payload: true
})
```

The print's `state` is an object containing the current print informations:

- `ticketPDF` is the string of a base64 pdf corresponding to the created ticket. It can also be `null`.
- `ticketCreationRequested` is the request triggered with a `createticket` input [action](#action-types)
- `printRequested` is the request triggered with a `printticket` input [action](#action-types)

Call the `dispatcher` with a `IPrintAction` obejct as a parameter. Refer to the `printReducer` for more informations.

```ts
appointment: {
	state: {
		isCheckingIn: false,
		isCheckingOut: false,
		isCheckedIn: false,
		isCheckedOut: false,
	},
	dispatcher,
}

ticket.dispatcher({
	type: APPOINTMENT_ACTION_TYPE.UPDATECHECKEDIN,
	payload: true
})
```

The appointment's `state` keeps track of the check in/out state:

- `isCheckingIn` is updated with a `checkin` input [action](#action-types)
- `isCheckingOut` is updated with a `checkout` input [action](#action-types)
- `isCheckedIn` is updated once the qr code read by the `scanner` has been checked in the EasyQueue module.
- `isCheckedOut` is updated once the qr code read by the `scanner` has been checked out of the EasyQueue module.

Call the `dispatcher` with a `IAppointmentAction` object as a parameter. Refer to the `appointmentReducer` for more informations.

```ts
error: {
	state: {
		hasError: false,
		errorCode: ERROR_CODE.A200,
		message: "",
	},
	dispatcher,
}

error.dispatcher({
	type: ERROR_ACTION_TYPE.SETERROR,
	payload: {
			hasError: true,
			errorCode: ERROR_CODE.B500,
			message: "Something went wrong",
			errorServiceId: 4,
		}
})
```

The error's `state` are the error informations:

- `hasError` triggers the error display.
- `errorCode` is the error code reference. Refer to the documentation provided with the `ERROR_CODE` enum definition for details about each code.
- `message` is a string to be displayed along with the error image for more information about the error.
- `errorServiceId` is optional and allows to target a specific service for [service closed errors](#errormanagement).

Call the `dispatcher` with a `IErrorAction` object as a parameter. Refer to the `errorReducer` for more informations.

```ts
customPage: {
	state: undefined,
	dispatcher,
}

customPage.dispatcher(<MyCustomPage />)
```

The customPage's `state` is the current customPage inserted into the flow. It is defined outside of the Engine on the widget's side. It can be a `JSX.Element` or `undefined`.

Call the `dispatcher` with a `JSX.Element` or `undefined` as a parameter to display or hide your custom page component.
