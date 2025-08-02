import React from 'react';
import { Card, CardContent, Box, List, ListItem, ListItemText } from '@mui/material';

// GoalCard Component
const GoalCard = ({ goals, selectedValue, onGoalClick }: any) => (
  <Card variant="outlined" sx={{ height: '100%' }} className="bg-white">
    <CardContent sx={{ width: '100%', padding: 0, boxShadow: 'none' }}>
      <Box sx={{ display: "grid", width: "100%" }}>
        <GoalList goals={goals} selectedValue={selectedValue} onGoalClick={onGoalClick} />
      </Box>
    </CardContent>
  </Card>
);

// GoalList Component
const GoalList = ({ goals, selectedValue, onGoalClick }: any) => (
  <List sx={{ maxHeight: "100%", maxWidth: "100%" }}>
    {goals.map((goal: any) => (
      <GoalListItem
        key={goal.name}
        goal={goal}
        selectedValue={selectedValue}
        onClick={() => onGoalClick(goal.name)}
      />
    ))}
  </List>
);

// GoalListItem Component
const GoalListItem = ({ goal, selectedValue, onClick }: any) => (
  <ListItem
    onClick={onClick}
    sx={{
      "&:hover": { backgroundColor: "#008755", color: "white" },
      backgroundColor: selectedValue === goal.name ? "#008755" : "inherit",
      color: selectedValue === goal.name ? "white" : "inherit",
      paddingY: 0.5,
      cursor: "pointer",
    }}
  >
    <ListItemText className="dubai-med" primary={goal.name} />
  </ListItem>
);



export default GoalCard;
