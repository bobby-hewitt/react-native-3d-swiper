import React, { Component } from 'react';
import {
  View,
  PanResponder,
  Dimensions,
  Easing,
  Animated,
} from 'react-native';
import styles from './styles'

export default class SwiperContainer extends Component {

	static defaultProps = {
		minimumScale: 0.7,
		minimumOpacity: 0.9,
		overlap: 60,
		margin: 15,
		duration: 100,
		swipeThreshold: 100,
   	};

	constructor(props){
		super(props)
		this.minimumScale = this.props.minimumScale
		this.minimumOpacity = this.props.minimumOpacity		
		this.overlap = this.props.overlap
		this.margin = (Dimensions.get('window').width - this.props.cardWidth) / 2
		this.duration = this.props.duration
		this.cardWidth = this.props.cardWidth
		this.swipeThreshold = 100
		this.state ={
			animationComplete: true,
			opacityToFade: new Animated.Value(1),
			opacityToAppearLeft: new Animated.Value(this.minimumOpacity),
			opacityToAppearRight: new Animated.Value(this.minimumOpacity),
			containerOffset: new Animated.Value(this.margin),
			scaleToGrowLeft: new Animated.Value(this.minimumScale),
			scaleToGrowRight: new Animated.Value(this.minimumScale),
			scaleToShrink: new Animated.Value(1),
			cards: [],
			zIndex: [3,2,1,0],
			activeX: 0,
		}
	}

	componentWillMount(){
		//create elements from children provided
		let cards = []
		React.Children.map(this.props.children, ((child) => {
			let temp = React.cloneElement(child)
			cards.push(temp)
		}))
		this.setState({cards:cards})
		//create reference to offset value
		this.state.containerOffset.addListener(({value}) => this._value = value);

		this._panResponder = PanResponder.create({
	      onStartShouldSetPanResponder: (evt, gestureState) => true,
	      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
	      onMoveShouldSetPanResponder: (evt, gestureState) => true,
	      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
	      onPanResponderMove: (evt, gestureState) => {
	      	let dx = gestureState.dx
	      	//handle z index of cards so card becoming active always shows top
      		if (dx > 1 && this.state.zIndex !==[2,1,3,0]){
      			this.setState({zIndex: [2,1,3,0]})
      		} else if (dx < -1 && this.state.zIndex !==[2,3,1,0]){
 			this.setState({zIndex: [2,3,1,0]})
      		}
      		//swipe right if swipeThreshold is reached
			if (gestureState.dx > this.swipeThreshold && ((this.state.activeX > 0) || (this.state.activeX > 1 && !animationComplete))){
				if (!this.state.swipeRegistered){
					this.setState({swipeRegistered: true, swipeDirection: 'right', animationComplete: false})
					this.swipeRight()	
				}
			} 
			//swipe left if swipe threshold is reached
			else if (gestureState.dx  < this.swipeThreshold * -1 && this.state.activeX < this.state.cards.length-1){
				if (!this.state.swipeRegistered){
					this.setState({swipeRegistered: true, swipeDirection: 'left', animationComplete: false})
					this.swipeLeft()	
				}
			} 
			// handle touch responsiveness before final animation is called
			else {
					let valToSet = dx / 800
					if (this.state.activeX !== 0 || this.state.activeX !== this.state.cards.length-1){
						this.state.containerOffset.setValue(this.state.containerOffset._value + (dx / 80))
					}
					if (dx > 0){
						console.log('greater than 0')
						this.state.opacityToAppearLeft.setValue(this.minimumOpacity+valToSet)
						this.state.scaleToGrowLeft.setValue(this.minimumScale+valToSet)

						this.state.opacityToFade.setValue(1-valToSet)
						this.state.scaleToShrink.setValue(1-valToSet)
					} else {
						this.state.scaleToGrowRight.setValue(this.minimumScale+valToSet*-1)
						this.state.opacityToFade.setValue(this.minimumOpacity+valToSet*-1)
	
						this.state.opacityToAppearRight.setValue(1-valToSet*-1)
						this.state.scaleToShrink.setValue(1-valToSet*-1)
					}
				}
	      	},
		    onPanResponderTerminationRequest: (evt, gestureState) => true,
		    onPanResponderRelease: (evt, gestureState) => {
		      	this.setState({swipeRegistered: false})
		    	//reset animation positions if threshold not reached
		      	if (this.state.animationComplete){
			      	if (this.state.zIndex !==[3,2,1,0]){
			      		this.setState({zIndex: [3,2,1,0]})
			      	}
		      		Animated.parallel([
						Animated.timing(
							this.state.containerOffset,
						    {toValue:  -1* (this.state.activeX * (this.cardWidth + this.overlap * -1) - this.margin) ,
						    duration: this.duration,
						    easing: Easing.easeInOut}
						),				
						Animated.timing(
						    this.state.scaleToGrowLeft,
						    {toValue: this.minimumScale,
						   duration: this.duration,
							easing: Easing.easeInOut}
						),
						Animated.timing(
						    this.state.scaleToShrink,
						    {toValue: 1,
						   duration: this.duration,
							easing: Easing.easeInOut}
						),
						Animated.timing(
						    this.state.opacityToAppearLeft,
						    {toValue: this.minimumOpacity,
						   duration: this.duration,
							easing: Easing.easeInOut}
						),
						Animated.timing(
						    this.state.opacityToFade,
						    {toValue: 1,
						   duration: this.duration,
							easing: Easing.easeInOut}
						),
						Animated.timing(
						    this.state.scaleToGrowRight,
						    {toValue: this.minimumScale,
						    duration: this.duration,
							easing: Easing.easeInOut}
						),			
						Animated.timing(
						    this.state.opacityToAppearRight,
						    {toValue: this.minimumOpacity,
						    duration: this.duration,
							easing: Easing.easeInOut}
					)], { useNativeDriver: true }).start()		
		      	}
		    },
	     	onPanResponderTerminate: (evt, gestureState) => {
	      		console.log('Pan responder has been terminated, check conflicts')
	      	},
		    onShouldBlockNativeResponder: (evt, gestureState) => {
		        return true;
		    },
	    }); 
	}
	swipeLeft(){
		Animated.parallel([
			Animated.timing(
			    this.state.containerOffset,
			    {toValue: this.state.containerOffset._value - (this.cardWidth + this.overlap * -1),
			    duration: this.duration,
				easing: Easing.easeInOut}
			),			
			Animated.timing(
			    this.state.scaleToGrowRight,
			    {toValue: 1,
			    duration: this.duration,
				easing: Easing.easeInOut}
			),
			Animated.timing(
			    this.state.opacityToAppearRight,
			    {toValue: 1,
			    duration: this.duration,
				easing: Easing.easeInOut}
			),
			Animated.timing(
			    this.state.opacityToFade,
			    {toValue: this.minimumOpacity,
			    duration: this.duration,
				easing: Easing.easeInOut}
			),
			Animated.timing(
			    this.state.scaleToShrink,
			    {toValue: this.minimumScale,
			    duration: this.duration,
				easing: Easing.easeInOut}
			)
		], { useNativeDriver: true }).start((completed) => {
			this.setState({activeX: this.state.activeX + 1, animationComplete: true, zIndex: [3,2,1,0]}, () => {
				this.state.containerOffset.setValue( -1* (this.state.activeX * (this.cardWidth + this.overlap * -1) - this.margin)  )
			})
			this.state.opacityToFade.setValue(1)
			this.state.opacityToAppearRight.setValue(this.minimumOpacity)
			this.state.scaleToGrowRight.setValue(this.minimumScale)
			this.state.scaleToShrink.setValue(1)
		})
	}

	swipeRight(){
		Animated.parallel([
			Animated.timing(
			    this.state.containerOffset,
			    {toValue: this.state.containerOffset._value + (this.cardWidth + this.overlap * -1),
			    duration: this.duration,
			    easing: Easing.easeInOut
			    }
			),				
			Animated.timing(
			    this.state.scaleToGrowLeft,
			    {toValue: 1,
			   duration: this.duration,
				easing: Easing.easeInOut}
			),
			Animated.timing(
			    this.state.scaleToShrink,
			    {toValue: this.minimumScale,
			   duration: this.duration,
				easing: Easing.easeInOut}
			),
			Animated.timing(
			    this.state.opacityToAppearLeft,
			    {toValue: 1,
			   duration: this.duration,
				easing: Easing.easeInOut}
			),
			Animated.timing(
			    this.state.opacityToFade,
			    {toValue: this.minimumOpacity,
			   duration: this.duration,
				easing: Easing.easeInOut}
			),
		], { useNativeDriver: true }).start((completed) => {
			let activeToAdd = this.state.activeX >0 ? -1 : 0
			this.setState({activeX: this.state.activeX + activeToAdd, animationComplete: true, zIndex: [3,2,1,0]}, () => {
				this.state.containerOffset.setValue( -1* (this.state.activeX * (this.cardWidth + this.overlap * -1) - this.margin)  )
			})
			this.state.opacityToFade.setValue(1)
			this.state.opacityToAppearLeft.setValue(this.minimumOpacity)
			this.state.scaleToGrowLeft.setValue(this.minimumScale)
			this.state.scaleToShrink.setValue(1)
		})
	}

	render(){
				console.log(this.props.cardWidth)
		return(
			<Animated.View style={[styles.container, {marginLeft: this.state.containerOffset}]} {...this._panResponder.panHandlers}>
				{this.state.cards.map((card, i) => {
					if (this.state.activeX === i){
						return (
							<Animated.View key={i} style={[{marginRight: this.overlap * -1,zIndex: this.state.zIndex[0],width:this.props.cardWidth, opacity: this.state.opacityToFade,backgroundColor: 'blue',transform: [{scale: this.state.scaleToShrink}]}]} >
								{card}
							</Animated.View>
						)			

					} else if (i === this.state.activeX + 1){
						return (
							<Animated.View key={i} style={[{marginRight: this.overlap * -1,zIndex: this.state.zIndex[1],width:this.props.cardWidth, opacity: this.state.opacityToAppearRight, transform: [{scale: this.state.scaleToGrowRight}]}]} >
								{card}
							</Animated.View>
						)			
					} else if (i === this.state.activeX - 1){
						return (
							<Animated.View key={i} style={[{marginRight: this.overlap *-1,zIndex: this.state.zIndex[2],width:this.props.cardWidth, opacity: this.state.opacityToAppearLeft, transform: [{scale: this.state.scaleToGrowLeft}]}]} >
								{card}
							</Animated.View>
						)			
					} else {
						return (
							<Animated.View key={i} style={[{marginRight: this.overlap *-1,zIndex: this.state.zIndex[3],width:this.props.cardWidth, opacity:this.minimumOpacity, transform: [{scale: this.minimumScale}]}]} >
								{card}
							</Animated.View>
						)		
					}
				})}
			</Animated.View>
		)
	}
}