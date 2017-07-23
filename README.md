# react-native-3d-swiper

A javascript only perfromant, customisable 3d swiper for react-native.  

## Getting Started

```
import RNSwiper from 'react-native-3d-swiper'

<View
 <RNSwiper
      minimumScale: 0.7,  <!-- //scale of out of focus components -->
      minimumOpacity: 0.9, // opacity of out of focus components
      overlap: 60,  // the degree to which components overlap.  
      margin: 15, // the margin between the focus component and the edge of the container
      duration: 100, // animation duration on swipe
      swipeThreshold: 100, // minimum distance to swipe to trigger change in state>
        <SwipeCard color="#ebebeb" text="Hellooooo"/> // Takes any component as child, it is advisable to set 'flex':1, 
        <SwipeCard color="#998877" text="Hellooooo"/>
        <SwipeCard color="#123abc" text="Hellooooo"/>
        <SwipeCard color="#ebebeb" text="Hellooooo"/>
        <SwipeCard color="#987654" text="Hellooooo"/>
    </RNSwiper>
</View>
```

### Installing

```
npm i --save react-native-3d-swiper
```


## Contributing

TODO: Customisable animation, Lazy loading


## Authors

* **Bobby Hewitt** - *Initial work* - <bobby@bobbhewitt.co.uk> (https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/Bobby-hewitt/react-native-3d-swiper) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

