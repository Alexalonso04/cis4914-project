import React, { useState } from "react";

import {
  Grid,
  Form,
  GridColumn,
  Container,
  Header,
  Segment,
  Button,
  Message
} from "semantic-ui-react";

export default function EventCheckIn() {
  const [availableEvents, setAvailableEvents] = useState([]);
  const [checkInData, setCheckInData] = useState({
    company: "",
    eventCode: ""
  });

  const [errors, setErrors] = useState({});

  var { company, eventCode } = checkInData;

  const isInvald = company === "" || eventCode.length < 4;

  const onSubmit = () => {
    setCheckInData({
      company: company,
      eventCode: eventCode
    });
    console.log(checkInData);
  };

  const companies = [
    {
      key: "ame",
      value: "American Express",
      text: "American Express"
    },
    {
      key: "jpm",
      value: "JP Morgan",
      text: "JP Morgan"
    },
    {
      key: "cis",
      value: "Cisco",
      text: "Cisco"
    }
  ];

  var eventCodes = [
    {
      key: "afc",
      value: "12345",
      text: "12345"
    },
    {
      key: "afg",
      value: "46568",
      text: "46568"
    },
    {
      key: "saf",
      value: "23467",
      text: "23467"
    }
  ];

  return (
    <Container verticalAlign="middle">
      <Grid stackable centered columns={1} verticalAlign="middle">
        <GridColumn style={{ maxWidth: 300 }}>
          <Header as="h1">Check In</Header>
          <Segment>
            <Form onSubmit={onSubmit} error>
              <Form.Dropdown
                label="Company"
                name="company"
                placeholder="Type your company name"
                fluid
                selection
                search
                // value={checkInData.company}
                options={companies}
                onChange={(param, data) => {
                  company = data.value;
                  setCheckInData({
                    company: company,
                    eventCode: eventCode
                  });
                }}
              />
              <Form.Input
                fuid
                label="Event Code"
                maxLength="5"
                placeholder="5-Digit event code"
                value={checkInData.eventCode}
                name="eventCode"
                type="text"
                onChange={(param, data) => {
                  eventCode = data.value.toUpperCase();
                  setCheckInData({
                    company: company,
                    eventCode: eventCode
                  });
                  console.log(eventCode);
                  if (eventCode == "ABCDE") {
                    console.log("error detected");
                    setErrors({ content: "new error detected" });
                    console.log(errors);
                  } else {
                    setErrors({});
                  }
                }}
              />
              <Button
                text="Submit"
                disabled={isInvald}
                fluid
                type="submit"
                color="teal"
              >
                Submit
              </Button>
              {errors !== {} ? (
                ""
              ) : (
                <Message error header="Action Forbidden" content="error" />
              )}
            </Form>
          </Segment>
        </GridColumn>
      </Grid>
    </Container>
  );
}
