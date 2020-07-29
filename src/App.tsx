import React, { useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, triangle } from 'ionicons/icons';
import Notifications from './pages/Notifications';
import Notes from './pages/Notes';
import NotificationDetails from './pages/NotificationDetails';
import LocalNotificationCustom from './model/LocalNotificationCustom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import AddNotification from './pages/AddNotification';

const App: React.FC = () => {
  const [notifications, setNotifications] = useState<LocalNotificationCustom[]>([]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/notifications" exact={true}>
              <Notifications notifications={notifications} setNotifications={setNotifications}/>
            </Route>
            <Route path="/tab2" component={Notes} exact={true} />
            <Route path="/notifications/notificationdetails/:notificationId" exact={true}>
              <NotificationDetails notifications={notifications} setNotifications={setNotifications} />
            </Route>
            <Route path="/notifications/addnotification" exact={true}>
              <AddNotification notifications={notifications} setNotifications={setNotifications} />
            </Route>
            <Route path="/" render={() => <Redirect to="/notifications" />} exact={true} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="notifications" href="/notifications">
              <IonIcon icon={triangle} />
              <IonLabel>Erinnerungen</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/tab2">
              <IonIcon icon={ellipse} />
              <IonLabel>Notizen</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
}

export default App;
