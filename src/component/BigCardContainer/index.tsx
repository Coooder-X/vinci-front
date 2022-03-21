import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import BigCardPile from '../BigCardPile';
import * as d3 from 'd3';
import pubsub from 'pubsub-js';
import './index.css';

let svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> = d3.select('body');
const svgW = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
const svgH = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
const containerW = svgW * 0.9, containerH = svgH * 0.22;
const fontSize1 = containerH * 0.7 * 0.5, fontSize2 = containerH * 0.7 * 0.37;

const cardSize: Size = {
	width: containerH * 0.42,
	height: containerH * 0.7,
}
const beginY = (containerH - cardSize.height) / 2;
const padding = 8;
const newCardContainerW = cardSize.width + padding * 4, newCardContainerH = cardSize.height + padding * 4;
const pileSize: Size = {
	width: containerW - newCardContainerW - (containerH - cardSize.height) / 2 - 2 * padding,
	height: cardSize.height + padding * 4
}

const BigCardContainer: React.FC<{}> = (props) => {

	const [cardPile, setCardPile] = useState([] as Card[]);
	const [newIndex, setNewIndex] = useState(0);
	const [newCard, setNewCard] = useState({ num: '', isBlack: true } as Card);

	useEffect(() => {
		const div = d3.select("#CardPanel");
		svg = div.append("svg")
			.attr('overflow', 'visible')	//	超出 svg viewBox 的部分的元素能看见
			.attr('fill', '#FFFFFF')
			.attr("preserveAspectRatio", "xMidYMid meet")
			.attr("viewBox", [0, 0, containerW, containerH]);

		svg	//	新卡片的存放区
			.append('rect')
			.attr('width', newCardContainerW)
			.attr('height', newCardContainerH)
			.attr("fill", 'antiquewhite')
			.attr('stroke', 'black')
			.attr('rx', 10)
			.attr('ry', 10)
			.attr('x', (containerH - cardSize.height) / 2 - 2 * padding)
			.attr('y', (containerH - cardSize.height) / 2 - 2 * padding);

		svg	//	玩家牌堆存放区
			.append('rect')
			.attr('width', pileSize.width)
			.attr('height', pileSize.height)
			.attr("fill", 'antiquewhite')
			.attr('stroke', 'black')
			.attr('rx', 10)
			.attr('ry', 10)	//	圆角矩形
			.attr('x', (containerH - cardSize.height) / 2 + newCardContainerW + padding)
			.attr('y', (containerH - cardSize.height) / 2 - 2 * padding);

	}, []);

	useEffect(() => {
		if (newCard.num === '')
			return;
		const g = svg
			.append('g')
			.attr('x', (containerH - cardSize.height) / 2)	//	g 标签赋予和卡牌相同的起始位置，以便使用transform移动
			.attr('y', beginY);
		g
			.append('rect')
			.attr('width', cardSize.width)
			.attr('height', cardSize.height)
			.attr("fill", newCard.isBlack ? 'black' : 'white')
			.attr('stroke-width', '1px')
			.attr('stroke', 'black')
			.attr('rx', 5)
			.attr('ry', 5)
			.attr('x', (containerH - cardSize.height) / 2)
			.attr('y', beginY)
		g
			.append('text')
			.attr('font-size', () => newCard.num.length > 1 ? fontSize2 : fontSize1)
			.attr('font-weight', 'bold')
			.attr('text-decoration', 'underline')
			.attr("x", () => newCard.num.length === 1 ? cardSize.width / 2 + padding : cardSize.width / 2)
			.attr("y", beginY + (cardSize.height - fontSize1) / 2 + fontSize1 - 12)
			.attr("fill", newCard.isBlack ? 'white' : 'black')
			.attr('stroke-width', '1px')
			.attr('stroke', 'black')
			.attr("text-anchor", "start")
			.text(newCard.num);
	}, [newCard]);

	const getNewCardSvg = () => {	//	返回新摸的牌的 svg g标签对象
		const newCardG = svg.selectAll('g').select(function (d, i) {
			return i === cardPile.length - 1 ? this : null;
		});
		return newCardG;
	}

	const handleGetCard = () => {
		let num = Math.floor(Math.random() * 13).toString();
		num = num === '12'? '-' : num;
		const newcard: Card = { num: num, isBlack: Math.random() < 0.5 };
		setNewCard(newcard);
		const tmp = [...cardPile, newcard].sort((a, b) => { //	数字升序，黑在白前
			if (a.num === '-' || b.num === '-')
				return (a.num === '-'? -1 : 1);
			const an = parseInt(a.num), bn = parseInt(b.num)
			if (an === bn)
				return a.isBlack? -1 : 1;
			return an - bn;
		});
		setCardPile(tmp);
		for (let i = 0; i < tmp.length; ++i) {
			if (tmp[i].num === num && tmp[i].isBlack === newcard.isBlack) {
				setNewIndex(i);
				break;
			}
		}
	}

	const handleInsert = () => {
		pubsub.publish('insertCard');
	}

	return (
		<>
			<div>
				<Button onClick={handleGetCard}>
					{'get'}
				</Button>
				<Button onClick={handleInsert}>
					{'insert'}
				</Button>
				<div id='CardPanel' className='big-card-container' />
			</div>
			<BigCardPile
				svg={svg}
				cardPile={cardPile}
				cardSize={cardSize}
				pileSize={pileSize}
				newIndex={newIndex}
				getNewCardSvg={getNewCardSvg}
				newCard={newCard} />
		</>
	);
}

export default BigCardContainer;