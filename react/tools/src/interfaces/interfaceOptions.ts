export interface Options_props {
	mobileView : boolean,

	mode : string,
	changeMode : React.Dispatch<React.SetStateAction<string>>,

	options : Map<string, boolean>,
	updateOptions(opt: string): void
}

export interface Menu_props {
	isOpen : boolean,

	mode : string,
	changeMode : React.Dispatch<React.SetStateAction<string>>,

	options : Map<string, boolean>,
	updateOptions(opt: string): void
}