import React, { useEffect, useState } from 'react';
import * as d3 from "d3";

const gap = 10;
const cardSize: Size = {
	width: 60,
	height: 100
}
const size: Size = {
	width: 1000,
	height: 180
}

// let svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> = d3.select("#cardPanel").append("svg").attr("viewBox", [0, 0, size.width, size.height]);
let svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> = d3.select('body');
const BigCardPile: React.FC<BigCardPileProps> = (props) => {

	// let svg: any = {};
	const [posList, setPosList] = useState(([] as Object[]));

	useEffect(() => {
		const div = d3.select("#cardPanel");
		svg = div.append("svg").attr("viewBox", [0, 0, size.width, size.height]);
		// svg.
		// 	append('rect')
		// 	.attr('width', size.width)
		// 	.attr('height', size.height)
		// 	.attr("fill", '#FFFFFF')
		// 	.attr('x', 0).attr('y', 0);
	}, []);

	useEffect(() => {
		const newCard = props.getNewCard();
		newCard.select('rect').attr('fill', 'red').attr('x', 200);
		// console.log('newcard', newCard.select('rect'));
		

		const totalWidth = props.cardPile.length * cardSize.width + (props.cardPile.length - 1) * gap;
		const beginX = size.width / 2 - totalWidth / 2;
		const data = props.cardPile.map((num, index) => {
			return { num: num, x: beginX + index * (gap + cardSize.width) };
		})
		// console.log('123', data);
		
		svg
			.selectAll('rect')
				.data(data)
				.join('rect')
				.attr('width', cardSize.width)
				.attr('height', cardSize.height)
				.attr("fill", '#000000')
				.attr('x', d => d.x).attr('y', 0);

		svg
			.selectAll('text')
				.data(data)
				.join('text')
				.attr('font-size', '55px')
				.attr('font-weight', 'bold')
				.attr("x", d => d.x + cardSize.width / 2)
				.attr("y", 65)
				.attr("fill", 'white')
				.attr("text-anchor", "middle")
				.text(d => d.num);

	}, [props.cardPile]);

	useEffect(() => {
		// console.log(props.newNum);
		// console.log(props.getNewCard());
	}, [props.cardPile]);

	return (
		<>
			<div>
				{props.cardPile}
			</div>
			<div>
				{props.newNum + ', ' + props.newIndex}
			</div>
			<div id='cardPanel'>

			</div>
		</>
	);
}

interface BigCardPileProps {
	cardPile: string[];
	newNum?: string | undefined;
	newIndex?: number | undefined;
	getNewCard: Function;
	newCard: any//d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
}//d3.Selection<SVGSVGElement, unknown, HTMLElement, any>

export default BigCardPile;