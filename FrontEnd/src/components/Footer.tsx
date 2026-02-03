import React from 'react';
import { FaCopyright } from 'react-icons/fa';
import { GiSnake } from 'react-icons/gi';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const footerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
    },
};

const Footer: React.FC = () => {
    return (
        <motion.footer
            className="bg-black border-t border-white/5 pt-20"
            variants={footerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            <div className="max-w-[95%] mx-auto">
                <motion.div className="flex items-center justify-between flex-col sm:flex-row pb-10 sm:px-4" variants={itemVariants}>
                    <div className='w-full'>
                        <motion.div className="flex items-center gap-3 mb-6" variants={itemVariants}>
                            <motion.div
                                className="bg-[#0ddff2] rounded-full flex items-center justify-center text-black p-1.5"
                                variants={itemVariants}
                                whileHover={{ scale: 1.1 }}
                            >
                                <GiSnake className="text-3xl" />
                            </motion.div>
                            <motion.h2 className="text-white text-xl font-bold tracking-tight uppercase" variants={itemVariants}>
                                SLITHER UP
                            </motion.h2>
                        </motion.div>
                        <motion.p className="text-slate-500 max-w-sm mb-6 leading-relaxed" variants={itemVariants}>
                            The world's premier competitive snake experience. Built for the community, powered by the grid.
                        </motion.p>
                    </div>

                    <motion.div className="pt-8 border-white/5  md:text-nowrap" variants={itemVariants}>
                        <motion.p className="text-slate-600 text-sm flex items-center gap-1" variants={itemVariants}>
                            <FaCopyright /> {new Date().getFullYear()} SLITHER UP Entertainment. All rights reserved.
                        </motion.p>
                    </motion.div>
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default Footer;
