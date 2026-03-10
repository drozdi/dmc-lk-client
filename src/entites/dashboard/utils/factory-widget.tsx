import React from "react";

class FactoryWidget {
	private static registry: Map<IWidget["type"], React.ComponentType<any>> =
		new Map();
	static register(type: IWidget["type"], component: React.ComponentType<any>) {
		this.registry.set(type, component);
	}
	static create(type: IWidget["type"], props: any) {
		const Component = this.registry.get(type);
		if (!Component) {
			return <div>Unknown widget type: {type}</div>;
		}
		return <Component {...props} />;
	}
	static getAvailableTypes(): string[] {
		return Array.from(this.registry.keys());
	}
}

export default FactoryWidget;
