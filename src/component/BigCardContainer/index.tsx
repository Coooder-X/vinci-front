import { Button } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import BigCardPile from '../BigCardPile';
import * as d3 from 'd3';
import pubsub from 'pubsub-js';
import './index.css';
import socket from '../../utils/socket';

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
	const [newCardSvg, setNewCardSvg] = useState(svg as any);
	const [tmpCardQue, setTmpCardQue] = useState([] as any);
	const [svgCardLst, setSvgCardLst] = useState([] as SvgCard[]);

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

		// const blackPile = svg
		// 	.attr('id', 'blackPile')
		// 	.append('rect')
		// 	.attr('width', cardSize.width)
		// 	.attr('height', cardSize.height)
		// 	.attr("fill", 'black')
		// 	.attr('stroke-width', '1px')
		// 	.attr('stroke', 'black')
		// 	.attr('rx', 5)
		// 	.attr('ry', 5)
		// 	.attr('x', containerW / 2 - cardSize.width - 5)
		// 	.attr('y', -(svgH - cardSize.height) / 2)
		// 	.on('click', () => {
		// 		handleGainCard('black');
		// 	})
		// const whitePile = svg
		// 	.append('rect')
		// 	// .attr('cursor', 'pointer')
		// 	.attr('width', cardSize.width)
		// 	.attr('height', cardSize.height)
		// 	.attr("fill", 'white')
		// 	.attr('stroke-width', '1px')
		// 	.attr('stroke', 'black')
		// 	.attr('rx', 5)
		// 	.attr('ry', 5)
		// 	.attr('x', containerW / 2 + 5)
		// 	.attr('y', -(svgH - cardSize.height) / 2)
		// 	.on('click', () => {
		// 		handleGainCard('white');
		// 	})
	}, []);

	// useEffect(() => {
	// 	d3.select('#blackPile').on('click', () => {
	// 		handleGainCard('black');
	// 	})
	// })

	// useEffect(() => {
	// 	if (newCard.num === '')
	// 		return;

	// 	const g = svg
	// 		.append('g')
	// 		.attr('x', (containerH - cardSize.height) / 2)	//	g 标签赋予和卡牌相同的起始位置，以便使用transform移动
	// 		.attr('y', beginY);
	// 	g
	// 		.append('rect')
	// 		.attr('width', cardSize.width)
	// 		.attr('height', cardSize.height)
	// 		.attr("fill", newCard.isBlack ? 'black' : 'white')
	// 		.attr('stroke-width', '1px')
	// 		.attr('stroke', 'black')
	// 		.attr('rx', 5)
	// 		.attr('ry', 5)
	// 		.attr('x', (containerH - cardSize.height) / 2)
	// 		.attr('y', beginY)
	// 	g
	// 		.append('text')
	// 		.attr('font-size', () => newCard.num.length > 1 ? fontSize2 : fontSize1)
	// 		.attr('font-weight', 'bold')
	// 		.attr('text-decoration', 'underline')
	// 		.attr("x", () => newCard.num.length === 1 ? cardSize.width / 2 + padding : cardSize.width / 2)
	// 		.attr("y", beginY + (cardSize.height - fontSize1) / 2 + fontSize1 - 12)
	// 		.attr("fill", !newCard.isBlack ? 'white' : 'black')
	// 		.transition()
	// 		.duration(100)
	// 		.attr("fill", newCard.isBlack ? 'white' : 'black')
	// 		.attr('stroke-width', '1px')
	// 		.attr('stroke', 'black')
	// 		.attr("text-anchor", "start")
	// 		.text(newCard.num);

	// 	setNewCardSvg(g);
	// }, [newCard]);

	const createNewCardSvg = (newcard: Card) => {
		console.log('createNewCardSvg', newcard.num === '');
		if (newcard.num === '')
			return;

		const g = svg
			.append('g')
			.attr('x', (containerH - cardSize.height) / 2)	//	g 标签赋予和卡牌相同的起始位置，以便使用transform移动
			.attr('y', beginY);
		g
			.append('rect')
			.attr('width', cardSize.width)
			.attr('height', cardSize.height)
			.attr("fill", newcard.isBlack ? 'black' : 'white')
			.attr('stroke-width', '1px')
			.attr('stroke', 'black')
			.attr('rx', 5)
			.attr('ry', 5)
			.attr('x', (containerH - cardSize.height) / 2)
			.attr('y', beginY)
		g
			.append('text')
			.attr('font-size', () => newcard.num.length > 1 ? fontSize2 : fontSize1)
			.attr('font-weight', 'bold')
			.attr('text-decoration', 'underline')
			.attr("x", () => newcard.num.length === 1 ? cardSize.width / 2 + padding : cardSize.width / 2)
			.attr("y", beginY + (cardSize.height - fontSize1) / 2 + fontSize1 - 12)
			.attr("fill", !newcard.isBlack ? 'white' : 'black')
			.attr('stroke', !newcard.isBlack ? 'white' : 'black')
			.transition()
			.duration(100)
			.attr("fill", newcard.isBlack ? 'white' : 'black')
			.attr('stroke-width', '1px')
			.attr('stroke', 'black')
			.attr("text-anchor", "start")
			.text(newcard.num);

		setNewCardSvg(g);
		// setTmpCardQue([...tmpCardQue, g]);
		setTmpCardQue(() => [...tmpCardQue, g]);
		console.log('tmp', tmpCardQue);

	}

	// const getNewCardSvg = () => {	//	返回新摸的牌的 svg g标签对象
	// 	console.log('tmpque', tmpCardQue);
		
	// 	if (tmpCardQue.length) {
	// 		const tail = tmpCardQue[0];
	// 		console.log('yes, tail = ', tail);
	// 		const tmp = tmpCardQue;
	// 		tmp.shift();
	// 		setTmpCardQue(tmp);
	// 		return tail;
	// 	}
	// 	return null;
	// }

	const getNewCardSvg = useCallback(() => {	//	返回新摸的牌的 svg g标签对象
		console.log('size', cardPile.length);

		const newCardG = svg.selectAll('g').select(function (d, i) {
			return i === cardPile.length - 1 ? this : null;
		});
		return newCardG;
	}, [cardPile]);

	const handleGetCard = (num: string, isBlack: boolean) => {
		// let num = Math.floor(Math.random() * 13).toString();
		// num = num === '12' ? '-' : num;
		const newcard: Card = { num: num, isBlack };
		// createNewCardSvg(newcard);
		setNewCard(() => newcard);
		console.log('newcard', newcard);

		const tmp = [...cardPile, newcard].sort((a, b) => { //	数字升序，黑在白前
			if (a.num === '-' || b.num === '-')
				return (a.num === '-' ? -1 : 1);
			const an = parseInt(a.num), bn = parseInt(b.num)
			if (an === bn)
				return a.isBlack ? -1 : 1;
			return an - bn;
		});
		setCardPile(() => tmp);
		console.log('牌堆', tmp);
		
		console.log('tmp', tmp.length, 'pile', cardPile.length, 'newCard', newCard);

		for (let i = 0; i < tmp.length; ++i) {
			if (tmp[i].num === num && tmp[i].isBlack === newcard.isBlack) {
				setNewIndex(() => i);
				break;
			}
		}

		createNewCardSvg(newcard);
	}

	const handleGainCard = (color: string) => {
		// const color = Math.random() < 0.5? 'black' : 'white';
		// const gid = Math.random().toString();
		const pos1 = { x: containerW / 2 - cardSize.width - 5, y: -(svgH - cardSize.height) / 2 },
			pos2 = { x: containerW / 2 + 5, y: -(svgH - cardSize.height) / 2 };
		const pos = color === 'black' ? pos1 : pos2;
		const g = svg
			.append('g')
			// .attr('id', gid)
			.attr('x', pos.x)	//	g 标签赋予和卡牌相同的起始位置，以便使用transform移动
			.attr('y', pos.y);
		g
			.append('rect')
			.attr('width', cardSize.width)
			.attr('height', cardSize.height)
			.attr("fill", color)
			.attr('stroke-width', '1px')
			.attr('stroke', 'black')
			.attr('rx', 5)
			.attr('ry', 5)
			.attr('x', pos.x)
			.attr('y', pos.y);

		g
			.transition() // 启动过渡效果，链式调用
			.duration(500)
			.attr('transform', `translate(${-(pos.x - (containerH - cardSize.height) / 2)}, ${-(pos.y - beginY)})`)
			.ease(d3['easeCubicInOut'])

		// handleGetCard(color === 'black');
		socket.emit('handleGetNum', (data: string) => {

			setTimeout(() => {
				g.remove();
				console.log('data', data);
				handleGetCard(data, color === 'black');
				// handleGetCard(color === 'black');
				//	之前是测试的mock，但现在要把修改cardPile的逻辑提上来，否则在setTimeOut里还是之前的状态，拿不到最新的g标签
				//	setNewCard、setCardPile 提到本函数做, getCard 函数废弃，因为本函数是真正从后端拿数据的函数
				// handleGetCard(color === 'black');
				// setTimeout(() => {
				// 	//	insert 逻辑这里不该有，应该是猜牌结束后的逻辑
				// 	handleInsert();
				// }, 500)
			}, 1000);
		})

	}

	useEffect(() => {
		console.log({ newCard, newIndex, cardPile });
		handleGet(newCard, newIndex, cardPile, tmpCardQue);
	}, [tmpCardQue])//newCard, newIndex, cardPile, 

	const handleGet = (card: Card, index: number, cardPile: Card[], tmpCardQue: []) => {
		pubsub.publish('getInfo', { card, index, cardPile, tmpCardQue });
	}

	const handleInsert = () => {
		pubsub.publish('insertCard');
	}

	return (
		<>
			<div>
				{/* <Button onClick={handleGetCard}>
					{'get'}
				</Button> */}
				{/* <Button onClick={() => {
					// d3.select('#123');
					const div = d3.select("#asd");
					console.log(div);
					
				}}>{'test'}</Button> */}
				<Button onClick={handleInsert}>
					{'insert'}
				</Button>
				{/* <Button onClick={handleGainCard}>{'get card'}</Button> */}
			</div>

			<BigCardPile
				svg={svg}
				cardPile={cardPile}
				cardSize={cardSize}
				pileSize={pileSize}
				newIndex={newIndex}
				newCardSvg={newCardSvg}
				getNewCardSvg={getNewCardSvg}
				newCard={newCard} />

			<div style={{
				position: 'absolute',
				overflow: 'hidden',
				width: '100%',
				height: '100%',	//	
				backgroundColor: 'silver'
				// backgroundColor: 'transparent'
			}}>
				{/* <Button onClick={handleGainCard}>{'get card'}</Button> */}
				<div
					onClick={() => { handleGainCard('black'); }}
					style={{
						...cardDivStyple,
						backgroundColor: 'black',
						position: 'relative',
						transform: `translate(calc(-50% - ${0.5 * cardSize.width}px - 5px), -100%)`,
					}}></div>
				<div
					onClick={() => { handleGainCard('white'); }}
					style={{
						...cardDivStyple,
						backgroundColor: 'white',
						border: '1px solid black',
						position: 'relative',
						transform: `translate(calc(-50% - ${0.5 * cardSize.width}px + 5px), -100%)`,
					}}></div>
			</div>
			<div id='CardPanel' className='big-card-container' />

		</>
	);
}

const cardDivStyple = {
	width: `${cardSize.width}px`,
	height: `${cardSize.height}px`,
	borderRadius: '5px',
	// position: 'relative',
	display: 'inline-block',
	overflow: 'hidden',
	left: '50%',
	top: '50%',
	cursor: 'pointer',
}

interface SvgCard {
	index: number;
	card: Card;
	cardSvg: any;
}

export default BigCardContainer;