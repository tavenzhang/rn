
import { StackNavigator ,createStackNavigator} from 'react-navigation';

import WebViewSub from "./WebViewSub";
import HomeView from "./HomeView";

// const RoutStack = StackNavigator({
//     Home:{
//         screen:App,
//         //4. 添加标题
//     }
//
//     // subWeb:{
//     //     screen:WebViewSub,
//     //     navigationOptions:{
//     //         header: null
//     //     },
//     // }
// });

const RoutStack = createStackNavigator({
    HomeView: {
        screen: HomeView,
        navigationOptions:{
            header:null
        }
    },
        subWeb: {
            screen: WebViewSub,
            navigationOptions:{
                header:null
            }
        },

},
    {
        initialRouteName: 'HomeView',
        defaultNavigationOptions: {
            headerStyle: {
                // backgroundColor: '#f4511e',
            },
            headerBackTitle: null,
            // headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            header: null
}})

export default RoutStack
