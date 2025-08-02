require("@testing-library/jest-dom");
const { configure } = require("@testing-library/dom");
configure({ testIdAttribute: "data-testid" });
