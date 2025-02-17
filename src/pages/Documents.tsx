import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { FaUpload, FaEye } from "react-icons/fa";
import StatusBadge, { Status } from "../ui/StatusBadge";
import { toast } from "react-toastify";
import { ButtonIcon, ButtonSend, CustomFileInputButton } from "../ui/CustomButtons";
import { FaSpinner } from "react-icons/fa";
import { API_URL } from "../main";
import { FileInput } from "../ui/Inputs";

type Document = {
  id: string;
  type: "dni" | "license" | "address";
  fileUrl: string;
  status: "pending" | "approved" | "rejected";
};

type DocumentsState = {
  [key in Document["type"]]: { fileUrl: string; status: Document["status"] };
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const Box = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 320px;
  padding: 20px;
  display: flex;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.58);
  flex-direction: column;
`;

const FileInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const DocumentUpload = () => {
  const { register, handleSubmit, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState({
    dni: { fileUrl: "", status: "pending" },
    license: { fileUrl: "", status: "pending" },
    address: { fileUrl: "", status: "pending" },
  });

  useEffect(() => {
    const fetchDocuments = async () => {
      const response = await fetch(`${API_URL}/documents`);
      if (response.ok) {
        const documentsData: Document[] = await response.json();

        const updatedDocuments = documentsData.reduce((acc, doc) => {
          if (["dni", "license", "address"].includes(doc.type)) {
            acc[doc.type] = { fileUrl: doc.fileUrl, status: doc.status };
          }
          return acc;
        }, {} as DocumentsState);
        setDocuments({
          dni: updatedDocuments.dni || { fileUrl: "", status: "pending" },
          license: updatedDocuments.license || { fileUrl: "", status: "pending" },
          address: updatedDocuments.address || { fileUrl: "", status: "pending" },
        });
      }
    };

    fetchDocuments();
  }, []);

  const uploadFile = async (file: File) => {
    const validFileTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];
    if (!validFileTypes.includes(file.type)) {
      toast.warning(`Invalid file type. Only images and PDFs are allowed.`);
      return Promise.reject("Invalid file type. Only images and PDFs are allowed.");
    }

    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
      toast.warning("File size exceeds 5 MB limit.");
      return Promise.reject("File size exceeds 5 MB limit.");
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1000);
    });
  };

  const getRandomStatus = () => {
    const statuses = ["pending", "approved", "rejected"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const onSubmit = async () => {
    setLoading(true);
    for (const docType of ["dni", "license", "address"]) {
      const fileList = watch(`${docType}.file`);
      if (fileList && fileList.length > 0) {
        const file = fileList[0];

        try {
          const fileUrl = await uploadFile(file);
          const response = await fetch(`${API_URL}/documents`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: docType, fileUrl }),
          });

          if (response.ok) {
            toast.success("Document uploaded successfully");
            const savedDoc = await response.json();
            setDocuments((prev) => ({
              ...prev,
              [docType]: { fileUrl: savedDoc.fileUrl, status: getRandomStatus() },
            }));
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <Container>
      <h2>Documents</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          {["dni", "license", "address"].map((docType) => (
            <Card key={docType}>
              <h3>
                {docType === "dni"
                  ? "National ID"
                  : docType === "license"
                  ? "Driver’s License"
                  : "Proof of Address"}
              </h3>
              <FileInputContainer>
                <FileInput type="file" id={`${docType}-file`} {...register(`${docType}.file`)} />
                <CustomFileInputButton
                  type="button"
                  onClick={() => {
                    const fileInput = document.getElementById(`${docType}-file`);
                    if (fileInput) {
                      fileInput.click();
                    }
                  }}
                >
                  <FaUpload /> Choose file
                </CustomFileInputButton>
                {documents[docType as keyof typeof documents]?.fileUrl && (
                  <ButtonIcon
                    type="button"
                    onClick={() =>
                      window.open(documents[docType as keyof typeof documents].fileUrl, "_blank")
                    }
                  >
                    <FaEye style={{ fontSize: 20 }} />
                  </ButtonIcon>
                )}
              </FileInputContainer>
              <StatusBadge
                status={documents[docType as keyof typeof documents]?.status as Status}
              />
            </Card>
          ))}
        </Box>
        <ButtonSend type="submit" disabled={loading}>
          {loading ? (
            <FaSpinner style={{ fontSize: 20, animation: "spin 1s linear infinite" }} />
          ) : (
            "Send Documents"
          )}
        </ButtonSend>
      </Form>
    </Container>
  );
};

export default DocumentUpload;
