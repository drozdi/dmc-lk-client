import { hasGroupNestedData } from '../../utils/group-by';
import classes from '../style.module.css';
import type { TableBodyCellExpandProps } from '../type';
import { TableBodyCellWrap } from './cell-wrap';
import { TableBodyExpander } from './expander';

export function TableBodyCellExpand<T = object>({ node, column, level = 0 }: TableBodyCellExpandProps<T>) {
	if (!hasGroupNestedData(node, column)) {
		return (
			<TableBodyCellWrap<T>
				node={node}
				column={column}
				className={classes.expanderCell}
			/>
		);
	}
	return (
		<TableBodyCellWrap<T>
			node={node}
			column={column}
			level={level}
			className={classes.expanderCell}
		>
			<div className={classes.expanderHeaderInner}>
				<TableBodyExpander<T>
					kind="group"
					node={node}
					column={column}
					className={classes.expanderCell}
				/>
			</div>
		</TableBodyCellWrap>
	);
}
