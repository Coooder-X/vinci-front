import { Button } from 'antd';
import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import BigCardPile from '../BigCardPile';
import './index.css';

const cardSize: Size = {
	width: 60,
	height: 100
}
const size: Size = {
	width: 90,
	height: 140
}
let svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> = d3.select('body');

const BigCardContainer: React.FC<{}> = (props) => {

	const [cardPile, setCardPile] = useState([] as string[]);
	const [newNum, setNewNum] = useState('');
	const [newIndex, setNewIndex] = useState(-1);
	const [newCard, setNewCard] = useState({});

	useEffect(() => {
		const div = d3.select("#newCardPanel");
		svg = div.append("svg").attr("viewBox", [0, 0, 90, 140]);
		// svg.
		// 	append('rect')
		// 	.attr('width', 800)
		// 	.attr('height', 250)
		// 	.attr("fill", '#FFFFFF')
		// 	.attr('x', 0).attr('y', 0);
	}, []);

	useEffect(() => {
		if (newNum === '')
			return;
		// const g = svg.selectAll('g').data(newNum).join('g');
		const g = svg.append('g');
		g
			.append('rect')
			.attr('width', cardSize.width)
			.attr('height', cardSize.height)
			.attr("fill", '#000000')
			.attr('x', (size.width - cardSize.width) / 2)
			.attr('y', (size.height - cardSize.height) / 2)
		g
			.append('text')
			.attr('font-size', '55px')
			.attr('font-weight', 'bold')
			// .attr("x", cardSize.width / 2 + 15)
			.attr("x", cardSize.width / 2 + 15)
			.attr("y", 85)
			// .attr("y", 0)
			.attr("fill", 'white')
			.attr("text-anchor", "middle")
			.text(newNum);
		setNewCard(g);
	}, [newNum]);

	const getNewCard = ()/*: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>*/ => {
		// console.log(svg.selectAll('g'))
		const newCardG = svg.selectAll('g').select(function (d, i) {
			// console.log('index = ', i, 'lenth = ', cardPile.length);
			return i === cardPile.length - 1 ? this : null;
		});
		// console.log('newCardG', newCardG);

		return newCardG;
	}

	const handleInsert = () => {
		const num = Math.floor(Math.random() * 10).toString();
		setNewNum(num);
		const tmp = [...cardPile, num].sort((a, b) => (parseInt(a) - parseInt(b)));
		setCardPile(tmp);
		for (let i = 0; i < tmp.length; ++i) {
			if (tmp[i] === num) {
				setNewIndex(i);
				break;
			}
		}
	}

	return (
		<>
			<div>
				<Button onClick={handleInsert}>
					{'insert'}
				</Button>
				{/* <div id='newCardPanel' className='svg-container'> */}
					<div id='newCardPanel' className='new-card-container'>

					</div>
				{/* </div> */}
			</div>
			<div className='big-card-container'>
				<BigCardPile
					cardPile={cardPile}
					newNum={newNum}
					newIndex={newIndex}
					getNewCard={getNewCard}
					newCard={newCard} />
			</div>
		</>
	);
}

export default BigCardContainer;