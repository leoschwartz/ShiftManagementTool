import { useEffect, useState } from "react";
import Modal from "./utils/Modal";
import PropTypes from "prop-types";
import { getReport } from "../api/getReport";
import { useAtom } from "jotai";
import { userTokenAtom } from "../globalAtom";
import { updateReport } from "../api/updateReport";
import Notification from "./utils/Notification";

ReportModal.propTypes = {
  isModalOpen: PropTypes.bool,
  onClose: PropTypes.func,
  reportId: PropTypes.string,
};

function ReportModal(props) {
  const [userToken] = useAtom(userTokenAtom);
  const [customerSatisfactionScore, setCustomerSatisfactionScore] = useState(0);
  const [reliabilityScore, setReliabilityScore] = useState(0);
  const [efficiencyScore, setEfficiencyScore] = useState(0);
  const [attentionToDetailScore, setAttentionToDetailScore] = useState(0);
  const [adaptabilityScore, setAdaptabilityScore] = useState(0);
  const [problemSolvingScore, setProblemSolvingScore] = useState(0);
  const [upsellingScore, setUpsellingScore] = useState(0);
  const [professionalismScore, setProfessionalismScore] = useState(0);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [type, setType] = useState("success");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      const report = await getReport(userToken, props.reportId);
      if (report) {
        setCustomerSatisfactionScore(report.customerSatisfactionScore);
        setReliabilityScore(report.reliabilityScore);
        setEfficiencyScore(report.efficiencyScore);
        setAttentionToDetailScore(report.attentionToDetailScore);
        setAdaptabilityScore(report.adaptabilityScore);
        setProblemSolvingScore(report.problemSolvingScore);
        setUpsellingScore(report.upsellingScore);
        setProfessionalismScore(report.professionalismScore);
        setNote(report.note);
      }
    };
    fetchReport();
  }, []);

  const closeNotification = () => {
    setIsNotificationOpen(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const reportData = {
      customerSatisfactionScore,
      reliabilityScore,
      efficiencyScore,
      attentionToDetailScore,
      adaptabilityScore,
      problemSolvingScore,
      upsellingScore,
      professionalismScore,
      note,
    };
    const result = await updateReport(userToken, props.reportId, reportData);
    // console.log(result);
    setMessage("Report updated successfully!");
    setShowCloseButton(true);
    setIsNotificationOpen(true);
  };
  return (
    <Modal
      title="View/Edit report"
      isModalOpen={props.isModalOpen}
      onClose={props.onClose}
    >
      <div className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="report"
            >
              Customer Satisfaction Score:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              max={10}
              min={0}
              name="customerSatisfactionScore"
              value={customerSatisfactionScore}
              onChange={(e) => setCustomerSatisfactionScore(Number(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="report"
            >
              Reliability Score:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              max={8}
              min={0}
              name="reliabilityScore"
              value={reliabilityScore}
              onChange={(e) => setReliabilityScore(Number(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="report"
            >
              Efficiency Score:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              max={8}
              min={0}
              name="efficiencyScore"
              value={efficiencyScore}
              onChange={(e) => setEfficiencyScore(Number(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="report"
            >
              Attention to Detail Score:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              max={7}
              min={0}
              name="attentionToDetailScore"
              value={attentionToDetailScore}
              onChange={(e) => setAttentionToDetailScore(Number(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="report"
            >
              Adaptability Score:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              max={3}
              min={0}
              name="adaptabilityScore"
              value={adaptabilityScore}
              onChange={(e) => setAdaptabilityScore(Number(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="report"
            >
              Problem-solving Score:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              max={6}
              min={0}
              name="problemSolvingScore"
              value={problemSolvingScore}
              onChange={(e) => setProblemSolvingScore(Number(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="report"
            >
              Upselling Score:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              max={5}
              min={0}
              name="upsellingScore"
              value={upsellingScore}
              onChange={(e) => setUpsellingScore(Number(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="report"
            >
              Professionalism Score:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              max={10}
              min={0}
              name="professionalismScore"
              value={professionalismScore}
              onChange={(e) => setProfessionalismScore(Number(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="report"
            >
              Note:
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="note"
              value={note}
              onChange={(e) => setNote(Number(e.target.value))}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full ml-2"
              type="submit"
            >
              Update
            </button>
          </div>
        </form>
        {isNotificationOpen && (
          <Notification
            message={message}
            showCloseButton={showCloseButton}
            onClose={closeNotification}
            type={type}
          />
        )}
      </div>
    </Modal>
  );
}

export default ReportModal;
