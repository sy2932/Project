import React from "react";
import {
  Form,
  Button,
  Dropdown,
  Navbar,
  Container,
  FormControl,
  Table,
} from "react-bootstrap";
import {
  FaUserPlus,
  FaTrash,
  FaSearch,
  FaBell,
  FaUser,
  FaCheckSquare,
  FaSquare,
} from "react-icons/fa";
import "./component/Dashboard.css";

const emp = [
  { Eid: 1, name: "Yash", group: "hbdiyqwd" },
  { Eid: 2, name: "Yash", group: "sbhqwvdy" },
  { Eid: 3, name: "Yash", group: "xbqhwbdq" },
  { Eid: 4, name: "Alice", group: "qhbdxuqVW" },
  { Eid: 5, name: "Aysuh", group: 96 },
  { Eid: 6, name: "Aysuh", group: 96 },
  { Eid: 7, name: "Aysuh", group: 96 },
];

function App() {
  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <Navbar className="navbar shadow-sm">
        <Container className="navbar-container">
          <Navbar.Brand href="#">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/0c/Standard_Chartered_(2021).svg"
              alt="logo"
              height={40}
              className="me-3"
            />
          </Navbar.Brand>
          <div className="navbar-icons">
            <FaBell size={30} />
            <FaUser size={30} />
          </div>
        </Container>
      </Navbar>

      {/* Main content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <FaUserPlus size={50} />
          <FaSquare size={50} />
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Search & Filters */}
          <div className="search-filter-container">
            <Form className="d-flex search-bar">
              <FormControl type="search" placeholder="Search" />
              <Button variant="outline-secondary">
                <FaSearch />
              </Button>
            </Form>

            <Dropdown className="group-dropdown">
              <Dropdown.Toggle variant="outline-primary">
                Groups
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Group 1</Dropdown.Item>
                <Dropdown.Item>Group 2</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Button variant="outline-secondary">
              <FaTrash />
            </Button>
          </div>

          {/* Employee Table */}
          <Table bordered hover className="employee-table">
            <thead>
              <tr>
                <th>
                  <FaCheckSquare />
                </th>
                <th>Employee Id</th>
                <th>Name</th>
                <th>Group</th>
                <th>Profile</th>
                <th>Permission</th>
                <th>File</th>
                <th>Remove User</th>
              </tr>
            </thead>
            <tbody>
              {emp.map((i) => (
                <tr key={i.Eid}>
                  <td></td>
                  <td>{i.Eid}</td>
                  <td>{i.name}</td>
                  <td>{i.group}</td>
                  <td>
                    <FaSearch />
                  </td>
                  <td>
                    <FaSearch />
                  </td>
                  <td>
                    <FaSearch />
                  </td>
                  <td>
                    <FaSearch />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default App;
