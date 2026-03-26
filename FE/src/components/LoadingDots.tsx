import { motion } from "framer-motion";

const LoadingDots = () => {
    const containerVariants = {
        start: { transition: { staggerChildren: 0.2 } },
        end: { transition: { staggerChildren: 0.2 } },
    };

    const dotVariants = {
        start: { opacity: 0, scale: 0.5 },
        end: { opacity: 1, scale: 1 },
    };

    const dotTransition = {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
    };

    return (
        <motion.div
            style={{ display: "flex", gap: "8px",marginLeft:"0.35rem",marginBottom:"0.25rem"}}
            variants={containerVariants}
            initial="start"
            animate="end"
        >
            {[...Array(3)].map((_, i) => (
                <motion.span
                    key={i}
                    style={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: "gray",
                        borderRadius: "50%",
                    }}
                    variants={dotVariants}
                    transition={dotTransition}
                />
            ))}
        </motion.div>
    );
};

export default LoadingDots;
