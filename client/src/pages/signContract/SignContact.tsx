import { useEffect, useState } from "react";
import { User } from "../../types/User";
import "./SignContact.scss";
import { getUser } from "../../api/user";
import { decryptPrivateKey } from "../../helpers/decryptPrivateKey";

const contract = {
  contract: {
    jobId: "67b850a8716f134fcfd3f048",
    freelancerId: "67b84c1da844c148202891dd",
    employerId: "677e7dd91e8ecee4b7284ec3",
    bidId: "67b85176716f134fcfd3f050",
    totalAmount: 1000,
    agreedDeadline: "2025-03-10T00:00:00.000Z",
    freelancerSignature: null,
    employerSignature: null,
    status: "pending",
    _id: "67b85817c5a3638ada1d7202",
  },
};

export const SignContact: React.FC = () => {
  const [user, setUser] = useState<User | undefined>();

  const storedUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser(storedUserId);

        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  console.log(user);

  const sign = async () => {
    try {
      const contractText = JSON.stringify(contract);

      const response = await fetch(
        "http://localhost:8800/api/contract/sign/67b8cf51a33dcaa954840ffa",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contractText,
            role: "freelancer",
            userId: storedUserId,
          }),
        }
      );

      // Визначення результату відповіді
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="signcontact">
      <div className="signcontact__container">
        <div className="signcontact__body">
          <button onClick={sign}>Sign</button>
        </div>
      </div>
    </section>
  );
};
