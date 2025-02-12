import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { API_URL } from "../main";
import { toast } from "react-toastify";
import { ButtonModal, ExtendButton } from "../ui/CustomButtons";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  font-family: "Poppins", sans-serif;
  height: 100%;
`;
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
`;

const FilterContainer = styled.div`
  margin-bottom: 10px;
  display: flex;
  gap: 20px;
  align-items: center;
  width: 100%;
`;

const TableContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
  flex-grow: 1;
`;

const Table = styled.table`
  width: 90%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  flex-grow: 1;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 80%;
`;

const Select = styled.select`
  padding: 8px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const TableHead = styled.thead`
  background-color: #3600e0;
  color: white;
`;

const TableHeader = styled.th`
  padding: 12px;
  text-align: left;
  font-weight: 600;
`;

const TableRow = styled.tr<{ status: string }>`
  &:nth-child(even) {
    background-color: #f5f0ff;
    color: #4005a0;
  }
`;

const TableData = styled.td`
  padding: 12px;
  font-weight: 500;
  border-bottom: 1px solid #ddd;
`;

const Chip = styled.span<{ status: string }>`
  display: inline-block;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 15px;
  color: ${(props) =>
    props.status === "Pending"
      ? "#FF7E15"
      : props.status === "Confirmed"
      ? "#218838"
      : props.status === "Canceled"
      ? "#d9534f"
      : "#007bff"};
  background-color: ${(props) =>
    props.status === "Pending"
      ? "#FFEADD"
      : props.status === "Confirmed"
      ? "#d4edda"
      : props.status === "Canceled"
      ? "#f8d7da"
      : "#cce5ff"};
`;

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [newReturnDate, setNewReturnDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleExtendClick = (reservation: any) => {
    setSelectedReservation(reservation);
    setNewReturnDate(reservation.return);
    setIsModalOpen(true);
  };
  const updateReservation = async () => {
    if (!selectedReservation) return;

    try {
      const response = await fetch(`${API_URL}/reservations/${selectedReservation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ return: newReturnDate }),
      });

      if (!response.ok) throw new Error("Failed to extend reservation");

      setReservations((prevReservations) =>
        prevReservations.map((res) =>
          res.id === selectedReservation.id ? { ...res, return: newReturnDate } : res
        )
      );
      toast.success("Reservation updated");
      setIsModalOpen(false);
    } catch (error) {
      alert("Error extending reservation");
    }
  };

  const cancelReservation = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Canceled" }),
      });

      if (!response.ok) {
        throw new Error("Error canceling the reservation");
      }

      setReservations((prevReservations) =>
        prevReservations.map((res) => (res.id === id ? { ...res, status: "Canceled" } : res))
      );
      toast.success("Reservation canceled successfully");
    } catch (error) {
      alert("There was an error canceling the reservation");
    }
  };

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/reservations`);
        if (!response.ok) {
          throw new Error("Error loading reservations");
        }
        const data = await response.json();
        setReservations(data);
      } catch (err) {
        setError("Error loading reservations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const filteredReservations =
    filterStatus === "All"
      ? reservations
      : reservations.filter((res) => res.status === filterStatus);

  return (
    <Container>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Wrapper>
          <FilterContainer>
            <label>Filter by status: </label>
            <Select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Canceled">Canceled</option>
              <option value="Completed">Completed</option>
            </Select>
          </FilterContainer>
          <TableContainer>
            <Table>
              <TableHead>
                <tr>
                  <TableHeader>Vehicle</TableHeader>
                  <TableHeader>License Plate</TableHeader>
                  <TableHeader>Type</TableHeader>
                  <TableHeader>Owner</TableHeader>
                  <TableHeader>Contact</TableHeader>
                  <TableHeader>Pickup</TableHeader>
                  <TableHeader>Return</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </TableHead>
              <tbody>
                {filteredReservations.length > 0 ? (
                  filteredReservations.map((res, index) => (
                    <TableRow key={index} status={res.status}>
                      <TableData>{res.vehicle}</TableData>
                      <TableData>{res.plate}</TableData>
                      <TableData>{res.type}</TableData>
                      <TableData>{res.owner}</TableData>
                      <TableData>{res.contact}</TableData>
                      <TableData>
                        {res.pickup ? format(new Date(res.pickup), "dd/MM/yyyy") : "-"}
                      </TableData>
                      <TableData>
                        {res.return ? format(new Date(res.return), "dd/MM/yyyy") : "-"}
                      </TableData>
                      <TableData>
                        <Chip status={res.status}>{res.status}</Chip>
                      </TableData>
                      <TableData>
                        {res.status === "Confirmed" ? (
                          <ExtendButton onClick={() => handleExtendClick(res)}>Extend</ExtendButton>
                        ) : res.status !== "Canceled" && res.status !== "Completed" ? (
                          <ExtendButton bgColor="#DA2E2E" onClick={() => cancelReservation(res.id)}>
                            Cancel
                          </ExtendButton>
                        ) : (
                          "-"
                        )}
                      </TableData>
                    </TableRow>
                  ))
                ) : (
                  <tr>
                    <TableData colSpan={8} style={{ textAlign: "center", padding: "15px" }}>
                      No reservations found.
                    </TableData>
                  </tr>
                )}
              </tbody>
            </Table>
          </TableContainer>
        </Wrapper>
      )}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h3>Extend Reservation</h3>
            <DatePicker
              selected={newReturnDate}
              onChange={(date: Date | null) => setNewReturnDate(date)}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
            />
            <div>
              <ButtonModal bgColor="#54D20B" onClick={updateReservation}>
                Confirm
              </ButtonModal>
              <ButtonModal bgColor="#DA2E2E" onClick={() => setIsModalOpen(false)}>
                Cancel
              </ButtonModal>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Reservations;
