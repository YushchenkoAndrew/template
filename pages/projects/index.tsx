import { makeStyles, Typography } from "@material-ui/core";
import * as React from "react";
import NavBar from "../../components/NavBar/NavBar";
import NavItem from "../../components/NavBar/NavItem";

interface HomeProps {}

export default function Home(props: HomeProps) {
  const classes = useStyles();

  return (
    <>
      <NavBar>
        <NavItem name="Home" />
        <NavItem name="Home1" />
        <NavItem name="Home2" />
        <NavItem name="Home4" />
      </NavBar>
      <Typography variant="h1" className={classes.text}>
        Test
      </Typography>
    </>
  );
}

const useStyles = makeStyles({
  text: {
    flex: 9,
  },
});
