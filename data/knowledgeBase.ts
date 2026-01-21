
import { KnowledgePoint, QuizQuestion } from '../types';

export const KNOWLEDGE_BASE: KnowledgePoint[] = [
  {
    id: 'uav-definition',
    category: 'Basics',
    title: { zh: '无人机定义', en: 'UAV Definition' },
    definition: { 
      zh: '无人驾驶航空器（Unmanned Aircraft, UA）是指由控制站管理（包括远程操纵或自主飞行）的航空器。',
      en: 'An Unmanned Aircraft (UA) is an aircraft managed by a control station, which includes remote control or autonomous flight capability.'
    },
    keyPoints: {
      zh: ['没有驾驶员坐在座舱内', '可以远程操纵或自主飞行', '智能化程度高', '成本与风险相对较低'],
      en: ['No pilot in the cockpit', 'Remote controlled or autonomous', 'High intelligence levels', 'Lower cost and risk compared to manned aircraft']
    },
    examples: {
      zh: ['多旋翼无人机', '固定翼无人机', '无人直升机'],
      en: ['Multi-rotor UAV', 'Fixed-wing UAV', 'Unmanned Helicopter']
    },
    relatedTerms: ['classification-weight', 'flight-principles'],
    difficulty: 'Beginner'
  },
  {
    id: 'flight-principles',
    category: 'Technology',
    title: { zh: '飞行原理与升力', en: 'Flight Principles & Lift' },
    definition: { 
      zh: '无人机通过螺旋桨旋转产生升力。根据伯努利原理，流速越快压力越小，机翼上方的空气流速快，压力小，从而产生向上的升力。',
      en: 'Drones generate lift through rotating propellers. According to Bernoulli\'s principle, faster air flow results in lower pressure; air above the wing flows faster, creating upward lift.'
    },
    keyPoints: {
      zh: ['伯努利定理：流速快压力小', '螺旋桨推力：将空气向下推产生反作用力', '扭力抵消：相邻旋翼旋转方向相反以保持平衡', '飞控系统：调节转速控制姿态'],
      en: ['Bernoulli\'s Theorem: Faster flow, lower pressure', 'Propeller Thrust: Pushes air down to create reaction force', 'Torque Cancellation: Opposite rotation of adjacent rotors', 'Flight Control System: Adjusts speed to control attitude']
    },
    examples: {
      zh: ['竹蜻蜓实验', '吹纸片实验'],
      en: ['Bamboo Copter experiment', 'Blowing paper experiment']
    },
    relatedTerms: ['uav-definition', 'propulsion-systems'],
    difficulty: 'Intermediate'
  },
  {
    id: 'classification-weight',
    category: 'Basics',
    title: { zh: '质量分类标准', en: 'Weight Classification' },
    definition: { 
      zh: '根据起飞全重，无人机可分为微型、轻型、小型、中型和大型。',
      en: 'Based on takeoff weight, UAVs are categorized into Micro, Light, Small, Medium, and Large.'
    },
    keyPoints: {
      zh: ['微型：小于等于7kg', '轻型：7kg - 116kg', '小型：116kg - 5700kg', '大型：大于5700kg'],
      en: ['Micro: ≤ 7kg', 'Light: 7kg - 116kg', 'Small: 116kg - 5700kg', 'Large: > 5700kg']
    },
    examples: {
      zh: ['大疆晓 (Spark)', '军用察打无人机'],
      en: ['DJI Spark', 'Military Strike-Recon UAVs']
    },
    relatedTerms: ['uav-definition'],
    difficulty: 'Beginner'
  },
  {
    id: 'agriculture-application',
    category: 'Applications',
    title: { zh: '农业植保应用', en: 'Agricultural Protection' },
    definition: { 
      zh: '利用无人机进行农药喷洒、施肥及作物健康监测，显著提高效率并保护农民健康。',
      en: 'Using UAVs for pesticide spraying, fertilization, and crop monitoring to boost efficiency and protect farmers.'
    },
    keyPoints: {
      zh: ['精准喷洒：减少农药浪费', 'NDVI监测：通过遥感判断作物健康', '覆盖范围广：适合大规模农田', '自主航线：自动化作业'],
      en: ['Precision Spraying: Reduced waste', 'NDVI Monitoring: Remote sensing for health', 'Large Coverage: Ideal for vast fields', 'Autonomous Paths: Automated operations']
    },
    examples: {
      zh: ['极飞农业无人机', '大疆T系列植保机'],
      en: ['XAG Agriculture UAV', 'DJI T-series Agras']
    },
    relatedTerms: ['remote-sensing-basics', 'multi-spectral-sensors'],
    difficulty: 'Intermediate'
  },
  {
    id: 'remote-sensing-basics',
    category: 'Technology',
    title: { zh: '无人机遥感技术', en: 'UAV Remote Sensing' },
    definition: { 
      zh: '遥感（Remote Sensing）是指不接触物体，通过传感器感知并记录地面物体信息的技术。',
      en: 'Remote Sensing refers to the technology of sensing and recording information about ground objects via sensors without physical contact.'
    },
    keyPoints: {
      zh: ['传感器：可见光、多光谱、热红外', '数据采集：高分辨率影像', '应用广泛：测绘、巡检、环保', 'SLAM定位：同步定位与建图'],
      en: ['Sensors: Visual, Multi-spectral, Thermal Infrared', 'Data Collection: High-res imagery', 'Wide Applications: Surveying, Inspection, Environment', 'SLAM: Simultaneous Localization and Mapping']
    },
    examples: {
      zh: ['热红外搜救', '多光谱植保'],
      en: ['Thermal Search & Rescue', 'Multispectral Agras']
    },
    relatedTerms: ['agriculture-application', 'flight-principles'],
    difficulty: 'Advanced'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    topicId: 'uav-definition',
    question: { 
      zh: '下列哪项是无人机与传统飞机的最大区别？', 
      en: 'What is the primary difference between a UAV and a traditional aircraft?' 
    },
    options: { 
      zh: ['飞行高度', '动力来源', '座舱内是否有驾驶员', '机翼形状'], 
      en: ['Flight altitude', 'Power source', 'Whether there is a pilot in the cockpit', 'Wing shape'] 
    },
    correctIndex: 2,
    explanation: { 
      zh: '无人机最核心的定义就是“没有驾驶员坐在里面”。', 
      en: 'The core definition of a UAV is that there is no pilot sitting inside it.' 
    }
  },
  {
    id: 'q2',
    topicId: 'classification-weight',
    question: { 
      zh: '轻型无人机的质量范围是多少？', 
      en: 'What is the weight range for a Light UAV?' 
    },
    options: { 
      zh: ['小于7kg', '7kg - 116kg', '116kg - 5700kg', '大于5700kg'], 
      en: ['Less than 7kg', '7kg - 116kg', '116kg - 5700kg', 'More than 5700kg'] 
    },
    correctIndex: 1,
    explanation: { 
      zh: '根据最新的管理规定，轻型无人机在7kg到116kg之间。', 
      en: 'According to regulations, Light UAVs weigh between 7kg and 116kg.' 
    }
  },
  {
    id: 'q3',
    topicId: 'flight-principles',
    question: { 
      zh: '机翼产生升力的主要理论依据是？', 
      en: 'What is the primary theoretical basis for wing lift?' 
    },
    options: { 
      zh: ['万有引力定律', '伯努利原理', '欧姆定律', '阿基米德原理'], 
      en: ['Law of Gravitation', 'Bernoulli\'s Principle', 'Ohm\'s Law', 'Archimedes\' Principle'] 
    },
    correctIndex: 1,
    explanation: { 
      zh: '伯努利原理指出流体速度越快，压力越小，从而在机翼上下方形成压力差产生升力。', 
      en: 'Bernoulli\'s principle states that faster moving fluid exerts less pressure, creating a pressure difference for lift.' 
    }
  }
];
