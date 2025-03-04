
import * as Font from 'expo-font';

/*export const loadFonts = async () => {
    await Font.loadAsync({
        'SF-bold': require('../assets/fonts/SFPRODISPLAYBOLD.OTF'),
        'SF-medium': require('../assets/fonts/SFPRODISPLAYMEDIUM.OTF'),
        'SF-regular': require('../assets/fonts/SFPRODISPLAYREGULAR.OTF'),
        'SpaceMono-regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
};*/

Font.loadAsync({
    'SF-bold': require('../assets/fonts/SF_Pro/SF-Pro-Display-Bold.otf'),
    'SF-medium': require('../assets/fonts/SF_Pro/SF-Pro-Display-Medium.otf'),
    'SF-regular': require('../assets/fonts/SF_Pro/SF-Pro-Display-Regular.otf'),
    'SpaceMono-regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Neue-Bold': require('../assets/fonts/neue_regrade/Neue Regrade Bold.otf'),
})

export const fonts = {
    sfbold: 'SF-bold',
    sfmedium: 'SF-medium',
    sfregular: 'SF-regular',
    monoregular: 'SpaceMono-regular',
    neuebold: 'Neue-Bold',
};