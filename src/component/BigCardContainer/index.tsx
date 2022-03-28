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
	const [tmpCardSvgLst, setTmpCardSvgLst] = useState([] as SvgCard[]);

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

	const createNewCardSvg = (newcard: Card, newIndex: number) => {
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

		const newTmpCard: SvgCard = {
			card: newcard,
			index: newIndex,
			cardSvg: g
		};
		setTmpCardSvgLst(() => [...tmpCardSvgLst, newTmpCard]);
	}

	const handleGetCard = (num: string, isBlack: boolean) => {
		const newcard: Card = { num: num, isBlack };
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
		
		let idx = 0;
		for (let i = 0; i < tmp.length; ++i) {
			if (tmp[i].num === num && tmp[i].isBlack === newcard.isBlack) {
				idx = i;
				break;
			}
		}
		createNewCardSvg(newcard, idx);
	}

	const handleGainCard = (color: string) => {
		const pos1 = { x: containerW / 2 - cardSize.width - 5, y: -(svgH - cardSize.height) / 2 },
			pos2 = { x: containerW / 2 + 5, y: -(svgH - cardSize.height) / 2 };
		const pos = color === 'black' ? pos1 : pos2;
		const g = svg
			.append('g')
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

		socket.emit('handleGetNum', (data: string) => {	//	向后端拿到新牌的 mock 数据
			setTimeout(() => {
				g.remove();
				console.log('data', data);
				handleGetCard(data, color === 'black');
			}, 1000);
		})

	}

	useEffect(() => {
		pubsub.subscribe('removeTmpCard', () => {
			setTmpCardSvgLst(() => []);	//	BigCardPile 组件通知该函数，说明 tmp 区的牌已经插入完毕，这里清空。
		});	//	同时，由于下面的 hook 依赖了 svgCardLst，因此 BigCardPile 组件的 tmpCardSvgLst 也同步清空，达到目的。
	}, []);

	//	原先采用 props 传递，但 setState 是异步，导致子组件延迟获得数据。因此通过监听依赖，订阅函数之间通知子组件立即执行逻辑。
	useEffect(() => {	//	当 tmp 区牌生成或清空时，同步给 BigCardPile 组件。
		console.log(tmpCardSvgLst);
		handleGet(tmpCardSvgLst);
	}, [tmpCardSvgLst]);

	const handleGet = (tmpCardSvgLst: SvgCard[]) => {
		pubsub.publish('sync-tmp-card-list', tmpCardSvgLst);	//	同步 tmpCardSvgLst 到 BigCardPile 组件。
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
				cardSize={cardSize}
				pileSize={pileSize} />

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
	cardSvg: any;	//	svg selection 类型
}

export default BigCardContainer;