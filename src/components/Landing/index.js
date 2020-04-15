import React, { Component } from 'react';
import {
    BrowserRouter as Router, Link,
    Route, Switch,
} from 'react-router-dom';
import * as ROUTES from "../../constants/routes";

import {Container, Header, Responsive} from "semantic-ui-react";


class Landing extends Component {
  render() {
    return (
        <div>
            <Responsive minwidth={768}>
                <div className="masthead masthead-home">
                    <div className="overlay-home">
                        <Container>
                            <Header as ='h1' className="mastead-title" >CARAS</Header>
                        </Container>
                    </div>
                </div>
            </Responsive>
        </div>
        // <div>
        //     <div>
        //         LANDING PAGE
        //     </div>
        //     <div>
        //         <button>
        //             <Link to={ROUTES.RECOGNIZER}>RECOGNIZER</Link>
        //         </button>
        //     </div>
        // </div>
    );
  }
}
export default Landing;