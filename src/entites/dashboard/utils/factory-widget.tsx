export class FactoryWidget {
	private static registry: Map<IWidget["type"], IWidget> = new Map();
	static register(widget: IWidget) {
		if (this.registry.has(widget.type)) {
			console.warn(`Widget type: "${widget.type}" is registered`);
			return;
		}
		this.registry.set(widget.type, widget);
	}

	static create(type: IWidgetItem["type"], params: IWidgetItem["params"]) {
		const Component = this.registry.get(type)?.component;
		if (!Component) {
			return <div>Unknown widget type: {type}</div>;
		}
		return <Component {...params} />;
	}

	static getAvailableTypes(): IWidget["type"][] {
		return Object.keys(this.registry);
	}
	static getWidget(type: IWidget["type"]): IWidget {
		return this.registry.get(type) as IWidget;
	}
}
