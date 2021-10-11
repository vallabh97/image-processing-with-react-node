import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import SearchImage from "./pages/SearchImage";
import UploadImage from "./pages/UploadImage";
import ApplyFilters from "./pages/ApplyFilters";

export default function Routes() {
  return (
    <>
      <Switch>
        <Route path="/search-image">
          <SearchImage />
        </Route>

        <Route path="/upload-image">
          <UploadImage />
        </Route>

        <Route path="/apply-filters">
          <ApplyFilters />
        </Route>

        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </>
  );
}
