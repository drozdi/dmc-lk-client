import { useMemo } from 'react';
import { useTableDataContext } from '../../context';
import {
	buildBulkActionsContext,
	resolveVisibleBulkActions,
} from '../../utils/row-actions';
import {
	TableBulkActionsMenu,
	TableBulkActionsPanel,
} from '../row-actions/panel';

export type TableHeaderBulkActionsTarget = 'actions' | 'select';

export function useTableHeaderBulkActions(target: TableHeaderBulkActionsTarget) {
	const {
		selectable,
		selectedRows,
		nodes,
		bulkActions,
		bulkActionsPanel,
		hasActionsColumn,
	} = useTableDataContext();

	const bulkContext = useMemo(
		() => buildBulkActionsContext(nodes, selectedRows),
		[nodes, selectedRows],
	);

	const visibleBulkActions = useMemo(
		() => resolveVisibleBulkActions(bulkContext, bulkActions),
		[bulkContext, bulkActions],
	);

	const canShow =
		!!selectable &&
		selectedRows.length > 0 &&
		visibleBulkActions.length > 0 &&
		(target === 'actions' ? hasActionsColumn : !hasActionsColumn);

	return {
		canShow,
		bulkContext,
		visibleBulkActions,
		bulkActionsPanel: bulkActionsPanel ?? TableBulkActionsPanel,
	};
}

export function TableHeaderBulkActions({
	target,
	actionsMenu,
}: {
	target: TableHeaderBulkActionsTarget;
	actionsMenu?: boolean;
}) {
	const { canShow, bulkContext, visibleBulkActions, bulkActionsPanel } =
		useTableHeaderBulkActions(target);

	if (!canShow) {
		return null;
	}

	const BulkComponent = actionsMenu ? TableBulkActionsMenu : bulkActionsPanel;

	return <BulkComponent context={bulkContext} actions={visibleBulkActions} />;
}
