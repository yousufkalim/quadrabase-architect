import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const SubscriptionCard = ({ selected, setSelected, subscription }) => {
  return (
    <Card
      style={{
        border: selected === subscription?._id && "1px solid #3b373c",
        width: 320,
        margin: 20,
        marginLeft: 0,
      }}
      onClick={() => setSelected(subscription?._id)}
    >
      <CardContent>
        <Typography variant="h4">
          <i>{subscription?.name}</i>
        </Typography>
        <Typography variant="h6">Price: ${subscription?.price}</Typography>
        <Typography variant="h6">
          Number of Month: {subscription?.duration}
        </Typography>
        <Typography variant="h6">Credits: {subscription?.credit}</Typography>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
