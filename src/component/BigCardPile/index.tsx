import React, { useEffect, useState } from 'react';
import pubsub from 'pubsub-js';
import * as d3 from "d3";

const gap = 10;
type Svg = d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;

const svgW = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
const svgH = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
const containerW = svgW * 0.9, containerH = svgH * 0.22;

const BigCardPile: React.FC<BigCardPileProps> = (props) => {

	const { svg, cardSize, pileSize, /*cardPile, newIndex,*/ getNewCardSvg } = props;
	const [cardSvgLst, setCardSvgLst] = useState([] as Svg[]);
	const [newIndex, setNewIndex] = useState(-1);
	const [cardPile, setCardPile] = useState([] as any);
	const [tmpCardQue, setTmpCardQue] = useState([] as any);

const beginTmpX = (containerH - cardSize.height) / 2 - 2 * 8


	const moveCard = (cardSvg: Svg, x: number) => {
		cardSvg
			.transition() // 启动过渡效果，链式调用
			.duration(500)
			.attr('transform', `translate(${0}, ${-1.4 * cardSize.height})`)	//g 标签移动只能用 transfrom，直接改 x 无效
			.ease(d3['easeCubicInOut'])
			.transition()
			.duration(500)
			.attr('transform', `translate(${x}, ${-1.4 * cardSize.height})`)	// - parseInt(cardSvg.attr('x'))
			.ease(d3['easeCubicInOut'])
			.transition()
			.duration(800)
			.attr('transform', `translate(${x}, ${0})`);	//	transform 参数值是相对于最初的的坐标的
	}

	const insertCard = () => {
		//	由于控制时序问题，创建svg的调用放在setTimeout里，因此
		//	这里从props里取值会延后一个周期，不会立即取到新值。要用函数直接查找svg取
		const newCardSvg = getNewCardSvg();	//	获得新摸的牌的 svg g标签对象
		if (newCardSvg) {
			console.log('newCard');
		} else return;

		// const newCardSvg = props.newCardSvg;
		console.log('newCardSvg', newCardSvg, 'index=', newIndex);
		
		console.log('size', cardPile.length);
		
		let tmplst = cardSvgLst;
		tmplst.splice(newIndex, 0, newCardSvg);
		setCardSvgLst(tmplst);	//	更新牌堆 svg g标签数组
		console.log('cardSvgLst', cardSvgLst);
		
		const totalWidth = cardSvgLst.length * cardSize.width + (cardSvgLst.length - 1) * gap;
		const beginX = cardSize.width + gap * 2 + pileSize.width / 2 - totalWidth / 2;
		const posList = cardSvgLst.map((num, index) => {	//	所有牌（包括新牌）的位置数组
			return beginX + index * (gap + cardSize.width);
		});

		if (cardSvgLst.length === 1) {
			moveCard(newCardSvg, beginX);	//	牌堆没有牌，直接移动到中间
		} else {
			for (let i = 0; i < cardSvgLst.length; ++i) {
				if (i === newIndex) 
					continue;
				//	每个已存在的牌移动让位
				cardSvgLst[i]
					.transition()
					.duration(800)
					.attr('transform', `translate(${posList[i]}, ${0})`)
					.ease(d3['easeCubicInOut']);
			}
			moveCard(newCardSvg, posList[newIndex]);	//	最后插入新摸的牌
		}
	}

	//	依赖牌堆对象，每次摸牌使牌堆更新时，重新发布 insert 函数，才能保证 getNewCardSvg 获得最新摸的牌
	useEffect(() => {	
		console.log('update cardpile', props.cardPile.length, 'newindex', newIndex);
		
		pubsub.unsubscribe('insertCard');
		pubsub.subscribe('insertCard', insertCard);
	}, [props.cardPile, newIndex]);

	useEffect(() => {
		pubsub.subscribe('getInfo', (_, info: any) => {
			console.log('info', info);
			
			const { card, index, cardPile, tmpCardQue } = info;
			setCardPile(cardPile);
			setNewIndex(index);
			console.log('pubsub info', card, index, cardPile, tmpCardQue);
		})
	}, []);

	return (
		<>
		</>
	);
}

interface BigCardPileProps {
	svg: Svg;
	cardPile: Card[];
	cardSize: Size;
	pileSize: Size;
	newIndex: number;
	getNewCardSvg: Function;
	newCard: Card;
	newCardSvg: any;
}

export default BigCardPile;