import {
	Affix,
	Card,
	Loader,
	Transition,
	type AffixProps,
	type LoaderProps,
} from "@mantine/core";
import { useIsFetching } from "@tanstack/react-query";

interface LoaderStatusProps {
	position?: AffixProps["position"];
	size?: LoaderProps["size"];
}

export function LoaderStatus({
	position = { top: 20, right: 20 },
	size = "sm",
}: LoaderStatusProps) {
	const isFetching = Boolean(useIsFetching());

	return (
		<Affix position={position} zIndex={1100}>
			<Transition
				mounted={isFetching}
				transition="fade"
				duration={300}
				timingFunction="ease"
			>
				{(transitionStyles) => (
					<Card
						p="xs"
						bdrs="xl"
						bd="1px solid var(--mantine-color-default-border)"
						style={{
							...transitionStyles,
							pointerEvents: "none", // клики проходят сквозь индикатор
							zIndex: 1100, // поверх остального контента
						}}
					>
						<Loader size={size} />
					</Card>
				)}
			</Transition>
		</Affix>
	);
}
