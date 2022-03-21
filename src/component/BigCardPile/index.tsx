import React, { useEffect, useState } from 'react';
import pubsub from 'pubsub-js';
import * as d3 from "d3";

const gap = 10;
type Svg = d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;

const BigCardPile: React.FC<BigCardPileProps> = (props) => {

	const { svg, cardSize, pileSize, cardPile, newIndex, getNewCardSvg } = props;
	const [cardSvgLst, setCardSvgLst] = useState([] as Svg[]);

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
		const newCardSvg = getNewCardSvg();	//	获得新摸的牌的 svg g标签对象
		let tmplst = cardSvgLst;
		tmplst.splice(newIndex, 0, newCardSvg);
		setCardSvgLst(tmplst);	//	更新牌堆 svg g标签数组

		if (newCardSvg) {
			console.log('newCard');
		} else return;
		const totalWidth = cardPile.length * cardSize.width + (cardPile.length - 1) * gap;
		const beginX = cardSize.width + gap * 2 + pileSize.width / 2 - totalWidth / 2;
		const posList = cardPile.map((num, index) => {	//	所有牌（包括新牌）的位置数组
			return beginX + index * (gap + cardSize.width);
		});

		if (cardPile.length === 1) {
			moveCard(newCardSvg, beginX);	//	牌堆没有牌，直接移动到中间
		} else {
			for (let i = 0; i < cardPile.length; ++i) {
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
		pubsub.subscribe('insertCard', insertCard);
	}, [props.cardPile]);

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
}

export default BigCardPile;