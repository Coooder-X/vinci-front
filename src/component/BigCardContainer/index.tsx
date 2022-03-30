import { Button } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import BigCardPile from '../BigCardPile';
import * as d3 from 'd3';
import pubsub from 'pubsub-js';
import './index.css';
import socket from '../../utils/socket';
import { getCurUser } from '../../utils/functions';

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

const BigCardContainer: React.FC<BigCardContainerProps> = (props) => {

	const [cardPile, setCardPile] = useState([] as Card[]);
	const [tmpCardSvgLst, setTmpCardSvgLst] = useState([] as SvgCard[]);
	const [restCardNum, setRestCardNum] = useState({ blackRest: 13, whiteRest: 13 } as RestCardInfo)

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

	/**
	 * 两个参数定义了新摸的牌的 Card 信息和插入牌堆的序号
	 * 此处主要处理动画衔接，摸牌段 svg 在创建 1000ms 后销毁。要满足新创建的 svg 在 1000ms 时显示出来，
	 * 并且是淡入，rect 淡入后 500ms，字体淡入。
	 * so，进入函数后，前 500ms rect 透明，500-1000ms 淡入；1000ms 字体创建但 1000-1500ms 透明，1500-2000ms 字体显现。
	 * @param newcard 
	 * @param newIndex 
	 */
	const createNewCardSvg = (newcard: Card, newIndex: number) => {
		console.log('createNewCardSvg', newcard.num === '');
		if (newcard.num === '')
			return;
		const newG = svg
			.append('g')
			.attr('x', (containerH - cardSize.height) / 2)	//	g 标签赋予和卡牌相同的起始位置，以便使用transform移动
			.attr('y', beginY);
		newG
			.append('rect')
			.attr('width', cardSize.width)
			.attr('height', cardSize.height)
			.attr('rx', 5)
			.attr('ry', 5)
			.attr('x', (containerH - cardSize.height) / 2)
			.attr('y', beginY)
			.attr("fill", 'transparent')
			.attr('stroke', 'transparent')
			.attr('stroke-width', '1px')
			.transition()
			.duration(500)
			.attr("fill", 'transparent')
			.attr('stroke', 'transparent')
			.attr('stroke-width', '1px')
			.transition()
			.duration(500)
			.attr("fill", newcard.isBlack ? 'black' : 'white')
			.attr('stroke', 'black')

		newG
			.append('text')
			.attr('font-size', () => newcard.num.length > 1 ? fontSize2 : fontSize1)
			.attr('font-weight', 'bold')
			.attr('text-decoration', 'underline')
			.attr("x", () => newcard.num.length === 1 ? cardSize.width / 2 + padding : cardSize.width / 2)
			.attr("y", beginY + (cardSize.height - fontSize1) / 2 + fontSize1 - 12)
			.attr("fill", 'transparent')
			.attr('stroke', 'transparent')
			.transition()
			.duration(500)
			.attr("fill", 'transparent')
			.attr('stroke', 'transparent')
			.transition()
			.duration(500)
			.attr("fill", newcard.isBlack ? 'white' : 'black')
			.attr('stroke-width', '1px')
			.attr('stroke', 'black')
			.attr("text-anchor", "start")
			.text(newcard.num);

		const newTmpCard: SvgCard = {
			card: newcard,
			index: newIndex,
			cardSvg: newG
		};
		setTmpCardSvgLst(() => [...tmpCardSvgLst, newTmpCard]);
	}

	const handleSortCard = (num: string, isBlack: boolean) => {
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
			.ease(d3['easeCubicInOut']);

		//	此处先于第一段 svg 销毁前，拿到数据，创建 svg，在 第一段 svg 销毁前隐形，后显示。
		const getCardReq: GetCardReq = {
			playerId: props.playerId,
			roomName: props.roomName,
			isBlack: color === 'black'
		}
		socket.emit('handleGetNum', getCardReq, (data: GetCardRes) => {	//	向后端拿到新牌的 mock 数据
			handleSortCard(data.num, color === 'black');
			setRestCardNum(data.restCardNum);
		});

		setTimeout(() => {
			g.remove();
		}, 1000);
	}

	useEffect(() => {
		pubsub.subscribe('removeTmpCard', () => {
			setTmpCardSvgLst(() => []);	//	BigCardPile 组件通知该函数，说明 tmp 区的牌已经插入完毕，这里清空。
		});	//	同时，由于下面的 hook 依赖了 svgCardLst，因此 BigCardPile 组件的 tmpCardSvgLst 也同步清空，达到目的。
	}, []);

	//	原先采用 props 传递，但 setState 是异步，导致子组件延迟获得数据。因此通过监听依赖，订阅函数之间通知子组件立即执行逻辑。
	useEffect(() => {	//	当 tmp 区牌生成或清空时，同步给 BigCardPile 组件。
		console.log(tmpCardSvgLst);
		handleSyncTmpCard(tmpCardSvgLst);

		if (tmpCardSvgLst.length === 4) {	//	开局刚摸完牌，通知后端完成	(这个不能作为开局flag)
			setTimeout(props.onFinishGetCard, 2500);	//	等插入牌结束，再通知后端完成
		} else if (tmpCardSvgLst.length === 1) {	//	局间摸完牌，进入猜牌逻辑
			// props.notifyNext();
		}
	}, [tmpCardSvgLst]);

	const handleSyncTmpCard = (tmpCardSvgLst: SvgCard[]) => {
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
				{restCardNum.blackRest > 0 &&
					<div
						onClick={() => { handleGainCard('black'); }}
						style={{
							...cardDivStyple,
							backgroundColor: 'black',
							position: 'relative',
							transform: `translate(calc(-50% - ${0.5 * cardSize.width}px - 5px), -100%)`,
						}}>
					</div>}
				{restCardNum.whiteRest > 0 &&
					<div
						onClick={() => { handleGainCard('white'); }}
						style={{
							...cardDivStyple,
							backgroundColor: 'white',
							border: '1px solid black',
							position: 'relative',
							transform: `translate(calc(-50% - ${0.5 * cardSize.width}px + 5px), -100%)`,
						}}>
					</div>}
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

interface BigCardContainerProps {
	playerId: string | undefined;
	roomName: string | undefined;
	onFinishGetCard: Function;
	notifyNext: Function;
}

interface SvgCard {
	index: number;
	card: Card;
	cardSvg: any;	//	svg selection 类型
}

export default BigCardContainer;

/**
 * - 本组件包括左下角新牌暂存区，以及下方牌堆，牌堆放入子组件 BigCardPile 将插入逻辑和动画解耦。
 * - 实现：整个发牌部分，共用一个 svg，卡牌是 svg 下一个 g 标签，g 下有并列的一个 rect 和 text，构成卡牌。
 * - UI 部分: 摸牌时，牌堆为屏幕中心的两个 div 卡片，点击后从 div 处创建一个卡牌 svg，同时在暂存区生成一个透明卡牌，
 * 			透明牌已经获了取牌面。假牌移动到暂存区，然后销毁，同时透明的真牌淡入显现。此后执行插入逻辑，真牌被 BigCardPile
 * 			逻辑插入手牌堆。
 *
 * - 数据部分：摸牌时，点击 div 从后端获取牌面数值，创建卡牌 svg。开局时点击4次，则生成4个。每次卡牌生成在暂存区，
 * 			都会更新到 tmpCardSvgLst 数组（存放在 tmp 区的卡牌，包括每个卡牌对应的手牌堆 index 和 svg 对象）。
 * 			同时，依赖 tmpCardSvgLst 的 hook 会通过 pubsub 通知子组件，将 tmpCardSvgLst 同步到子组件的相同数据结构，
 * 			当需要插入时，子组件依此操作 tmpCardSvgLst 里卡牌 svg，执行插入动画，最后通知本组件清空 tmpCardSvgLst，同时同步自己。
 * 			手牌的排序逻辑在本组件执行，子组件通过维护自己的 svgList，和 posList，将每个手牌和坐标对应，插入时通过 newIndex 计算坐标。
 *
 * - 此前版本废弃原因：
 * 		1、此前使用 2个 svg 对象作为发牌堆，点击获取新牌，并卡牌 svg 从创建到插入都是同一个。
 * 				存在问题：卡牌初始位置因黑白导致不同，会导致插入手牌时，translate 的 x 坐标要根据颜色判断，复杂度和难度大大提高。
 * 						因此，使用假卡牌分离两段动画。
 * 						更麻烦的是，svg 添加事件需要在 hook 中初始化，而事件函数本身是依赖数据变化的，svg 添加过后函数就不再变化。
 *
 * 		2、此前使用 props 给子组件传递数据，如 newIndex，newCardSvg，cardPile，但这些值的 setState 是异步的，不会立即执行。
 * 				因此子组件获得的值比本组件慢一个生命周期，导致错误。所以，改为使用现在的方式：需要传递的数据封装到一起，通过
 * 				useEffect 监听它的变化，一旦 setSate，就通过 pubsub 传递给子组件，而不经过 props。子组件修改后，也通过 pubsub 同步过来。
 */