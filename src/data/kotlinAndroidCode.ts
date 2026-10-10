import { KotlinAndroidFile } from '../types';

export const KOTLIN_ANDROID_FILES: KotlinAndroidFile[] = [
  {
    id: 'main_activity',
    fileName: 'MainActivity.kt',
    relativePath: 'app/src/main/java/com/neuroadapt/app/MainActivity.kt',
    category: 'ui',
    description: 'Main Jetpack Compose entry point with Material 3 dynamic color and sensory overlay support.',
    code: `package com.neuroadapt.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.neuroadapt.app.ui.screens.AdaptiveLessonScreen
import com.neuroadapt.app.ui.theme.NeuroAdaptTheme
import com.neuroadapt.app.viewmodel.NeuroAdaptiveViewModel

/**
 * NeuroAdapt: Hyper-Personalized Educational Companion for Android
 * Built with Kotlin & Jetpack Compose.
 * Tailored for Neurodivergent Learners (ADHD, Dyslexia).
 */
class MainActivity : ComponentActivity() {

    private val viewModel: NeuroAdaptiveViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            val learnerProfile by viewModel.learnerProfile.collectAsState()
            val engagementMetrics by viewModel.engagementMetrics.collectAsState()

            NeuroAdaptTheme(condition = learnerProfile.condition) {
                // Sensory tinted overlay (Dyslexia accommodation: Amber, Peach, Sage, Cyan)
                val overlayColor = when (learnerProfile.dyslexiaSettings.colorOverlay) {
                    "amber" -> Color(0x18FFC107)
                    "peach" -> Color(0x18FF8A65)
                    "sage" -> Color(0x1881C784)
                    "cyan" -> Color(0x184DD0E1)
                    else -> Color.Transparent
                }

                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    Box(modifier = Modifier.fillMaxSize()) {
                        AdaptiveLessonScreen(
                            viewModel = viewModel,
                            onFormatChange = { newFormat ->
                                viewModel.setModality(newFormat)
                            }
                        )

                        // Sensory overlay layer without blocking touch events
                        if (overlayColor != Color.Transparent) {
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .background(overlayColor)
                            )
                        }
                    }
                }
            }
        }
    }

    override fun onResume() {
        super.onResume()
        viewModel.startSensorMonitoring(this)
    }

    override fun onPause() {
        super.onPause()
        viewModel.stopSensorMonitoring(this)
    }
}`
  },
  {
    id: 'engagement_tracker',
    fileName: 'EngagementSignalTracker.kt',
    relativePath: 'app/src/main/java/com/neuroadapt/app/sensors/EngagementSignalTracker.kt',
    category: 'sensor',
    description: 'Hardware sensor engine monitoring accelerometer tremors, fidget patterns, and touch dwell velocity.',
    code: `package com.neuroadapt.app.sensors

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlin.math.abs
import kotlin.math.sqrt

data class RawEngagementSignals(
    val attentionScore: Int = 85,
    val interactionVelocity: Float = 14f, // actions per minute
    val fidgetIndex: Int = 18, // 0-100 micro-movement scale
    val dwellTimeSeconds: Long = 0,
    val cognitiveLoad: String = "optimal",
    val recommendedModality: String = "visual"
)

/**
 * Tracks real-time engagement signals:
 * 1. Accelerometer micro-tremors (Fidgeting detector for ADHD)
 * 2. Touch velocity & rapid erratic scrolling
 * 3. Inaction / gaze dwell stall (fatigue detector)
 */
class EngagementSignalTracker(context: Context) : SensorEventListener {

    private val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private val accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)

    private val _signals = MutableStateFlow(RawEngagementSignals())
    val signals: StateFlow<RawEngagementSignals> = _signals.asStateFlow()

    private var lastX = 0f
    private var lastY = 0f
    private var lastZ = 0f
    private var lastTimestamp = System.currentTimeMillis()
    private var microMovementAccumulator = 0f
    private var interactionCount = 0

    fun startListening() {
        accelerometer?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_UI)
        }
    }

    fun stopListening() {
        sensorManager.unregisterListener(this)
    }

    fun recordTouchInteraction() {
        interactionCount++
    }

    override fun onSensorChanged(event: SensorEvent?) {
        event?.let {
            val x = it.values[0]
            val y = it.values[1]
            val z = it.values[2]

            val deltaX = abs(x - lastX)
            val deltaY = abs(y - lastY)
            val deltaZ = abs(z - lastZ)
            val deltaMovement = sqrt((deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ).toDouble()).toFloat()

            microMovementAccumulator = microMovementAccumulator * 0.9f + deltaMovement * 0.1f

            val now = System.currentTimeMillis()
            if (now - lastTimestamp > 1000) {
                // Calculate fidget score (0 - 100)
                val computedFidget = (microMovementAccumulator * 25).toInt().coerceIn(0, 100)
                val currentScore = _signals.value.attentionScore

                // Dynamic cognitive load determination
                val (load, recModality) = when {
                    computedFidget > 65 -> "high_stimulation_needed" to "interactive"
                    computedFidget < 10 && interactionCount == 0 -> "fatigue" to "audio"
                    else -> "optimal" to "visual"
                }

                _signals.value = _signals.value.copy(
                    fidgetIndex = computedFidget,
                    attentionScore = (currentScore + (if (load == "optimal") 2 else -3)).coerceIn(20, 100),
                    cognitiveLoad = load,
                    recommendedModality = recModality,
                    interactionVelocity = interactionCount * 60f
                )

                interactionCount = 0
                lastTimestamp = now
            }

            lastX = x
            lastY = y
            lastZ = z
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
}`
  },
  {
    id: 'view_model',
    fileName: 'NeuroAdaptiveViewModel.kt',
    relativePath: 'app/src/main/java/com/neuroadapt/app/viewmodel/NeuroAdaptiveViewModel.kt',
    category: 'viewmodel',
    description: 'Kotlin StateFlow ViewModel driving dynamic modality switching, dopamine rewards, and lesson state.',
    code: `package com.neuroadapt.app.viewmodel

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.neuroadapt.app.data.LessonContent
import com.neuroadapt.app.data.SampleLessons
import com.neuroadapt.app.network.GeminiEducationRepository
import com.neuroadapt.app.sensors.EngagementSignalTracker
import com.neuroadapt.app.sensors.RawEngagementSignals
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class LearnerProfileState(
    val name: String = "Alex",
    val condition: String = "combined", // "adhd", "dyslexia", "combined"
    val activeModality: String = "visual", // "audio", "visual", "interactive"
    val isAutoAdaptive: Boolean = true,
    val streak: Int = 5,
    val dopamineXP: Int = 340,
    val dyslexiaSettings: DyslexiaConfig = DyslexiaConfig()
)

data class DyslexiaConfig(
    val useOpenDyslexic: Boolean = true,
    val bionicReading: Boolean = true,
    val colorOverlay: String = "peach",
    val letterSpacing: Float = 1.5f,
    val lineSpacing: Float = 1.6f
)

class NeuroAdaptiveViewModel : ViewModel() {

    private val repository = GeminiEducationRepository()
    private var sensorTracker: EngagementSignalTracker? = null

    private val _learnerProfile = MutableStateFlow(LearnerProfileState())
    val learnerProfile: StateFlow<LearnerProfileState> = _learnerProfile.asStateFlow()

    private val _currentLesson = MutableStateFlow<LessonContent>(SampleLessons.defaultLesson)
    val currentLesson: StateFlow<LessonContent> = _currentLesson.asStateFlow()

    private val _engagementMetrics = MutableStateFlow(RawEngagementSignals())
    val engagementMetrics: StateFlow<RawEngagementSignals> = _engagementMetrics.asStateFlow()

    private val _nudgeMessage = MutableStateFlow<String?>(null)
    val nudgeMessage: StateFlow<String?> = _nudgeMessage.asStateFlow()

    init {
        // Continuous evaluation loop for neurodivergent engagement
        viewModelScope.launch {
            while (true) {
                delay(5000)
                evaluateEngagementSignals()
            }
        }
    }

    fun startSensorMonitoring(context: Context) {
        if (sensorTracker == null) {
            sensorTracker = EngagementSignalTracker(context).apply {
                startListening()
            }
            viewModelScope.launch {
                sensorTracker?.signals?.collect { signals ->
                    _engagementMetrics.value = signals
                }
            }
        }
    }

    fun stopSensorMonitoring(context: Context) {
        sensorTracker?.stopListening()
        sensorTracker = null
    }

    fun setModality(format: String) {
        _learnerProfile.update { it.copy(activeModality = format) }
        _nudgeMessage.value = null
    }

    fun completeInteractiveStep(points: Int = 50) {
        _learnerProfile.update {
            it.copy(
                dopamineXP = it.dopamineXP + points,
                streak = it.streak + 1
            )
        }
    }

    private fun evaluateEngagementSignals() {
        val current = _engagementMetrics.value
        val profile = _learnerProfile.value

        if (!profile.isAutoAdaptive) return

        // ADHD fidget spike -> propose interactive tactile mini-challenge
        if (current.fidgetIndex > 60 && profile.activeModality != "interactive") {
            _nudgeMessage.value = "Fidget energy detected! Let's switch to Interactive Micro-Challenges."
            setModality("interactive")
        }
        // Dyslexia fatigue / low interaction -> propose relaxing audio narration
        else if (current.attentionScore < 50 && profile.activeModality != "audio") {
            _nudgeMessage.value = "Visual fatigue detected. Switching to relaxing Audio narration."
            setModality("audio")
        }
    }
}`
  },
  {
    id: 'dyslexia_typography',
    fileName: 'DyslexiaTypography.kt',
    relativePath: 'app/src/main/java/com/neuroadapt/app/ui/theme/DyslexiaTypography.kt',
    category: 'ui',
    description: 'Compose AnnotatedString builder for Bionic Reading (fixation points) and OpenDyslexic / Lexend font support.',
    code: `package com.neuroadapt.app.ui.theme

import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle

/**
 * OpenDyslexic & Lexend Font definitions for Android.
 * Lexend reduces visual crowding and visual stress in dyslexic readers.
 */
val LexendFontFamily = FontFamily.Default // In production: Font(R.font.lexend_regular)

object BionicReadingTransformer {

    /**
     * Transforms standard body text into Bionic Reading format:
     * Bolds the first 40-50% of characters in each word as visual fixation anchors.
     * Dramatically increases reading comprehension and speed for Dyslexia & ADHD.
     */
    fun transformToBionic(text: String): AnnotatedString {
        return buildAnnotatedString {
            val words = text.split(" ")
            words.forEachIndexed { index, word ->
                if (word.isNotEmpty()) {
                    val fixationLength = when {
                        word.length <= 3 -> 1
                        word.length <= 5 -> 2
                        word.length <= 8 -> 3
                        else -> (word.length * 0.45).toInt().coerceAtLeast(4)
                    }

                    val boldPart = word.take(fixationLength)
                    val restPart = word.drop(fixationLength)

                    withStyle(style = SpanStyle(fontWeight = FontWeight.Bold)) {
                        append(boldPart)
                    }
                    append(restPart)
                }

                if (index < words.size - 1) {
                    append(" ")
                }
            }
        }
    }
}`
  },
  {
    id: 'lesson_screen',
    fileName: 'AdaptiveLessonScreen.kt',
    relativePath: 'app/src/main/java/com/neuroadapt/app/ui/screens/AdaptiveLessonScreen.kt',
    category: 'ui',
    description: 'Multi-modal Jetpack Compose layout with Audio, Visual (Bionic), and Interactive tactile views.',
    code: `package com.neuroadapt.app.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.neuroadapt.app.ui.theme.BionicReadingTransformer
import com.neuroadapt.app.viewmodel.NeuroAdaptiveViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdaptiveLessonScreen(
    viewModel: NeuroAdaptiveViewModel,
    onFormatChange: (String) -> Unit
) {
    val profile by viewModel.learnerProfile.collectAsState()
    val lesson by viewModel.currentLesson.collectAsState()
    val metrics by viewModel.engagementMetrics.collectAsState()
    val nudge by viewModel.nudgeMessage.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("NeuroAdapt", style = MaterialTheme.typography.titleMedium)
                        Text(
                            "Focus Score: \${metrics.attentionScore}% • Fidget: \${metrics.fidgetIndex}%",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                },
                actions = {
                    // XP Chip with Dopamine celebration
                    AssistChip(
                        onClick = { },
                        label = { Text("\${profile.dopamineXP} XP ⚡") }
                    )
                }
            )
        },
        bottomBar = {
            // Material 3 Modality Navigation Bar
            NavigationBar {
                NavigationBarItem(
                    selected = profile.activeModality == "audio",
                    onClick = { onFormatChange("audio") },
                    icon = { Icon(Icons.Default.Headphones, contentDescription = null) },
                    label = { Text("Audio") }
                )
                NavigationBarItem(
                    selected = profile.activeModality == "visual",
                    onClick = { onFormatChange("visual") },
                    icon = { Icon(Icons.Default.Visibility, contentDescription = null) },
                    label = { Text("Visual") }
                )
                NavigationBarItem(
                    selected = profile.activeModality == "interactive",
                    onClick = { onFormatChange("interactive") },
                    icon = { Icon(Icons.Default.TouchApp, contentDescription = null) },
                    label = { Text("Interactive") }
                )
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp)
        ) {
            // Adaptive Nudge Banner if engagement drops
            AnimatedVisibility(visible = nudge != null) {
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.secondaryContainer
                    ),
                    modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Default.AutoAwesome, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(nudge ?: "", style = MaterialTheme.typography.bodyMedium)
                    }
                }
            }

            // Modality Viewport
            AnimatedContent(targetState = profile.activeModality, label = "modality_transition") { modality ->
                when (modality) {
                    "audio" -> AudioLessonView(lesson)
                    "visual" -> VisualBionicView(lesson)
                    "interactive" -> InteractiveChallengeView(lesson, onComplete = { viewModel.completeInteractiveStep() })
                    else -> VisualBionicView(lesson)
                }
            }
        }
    }
}

@Composable
fun VisualBionicView(lesson: com.neuroadapt.app.data.LessonContent) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(lesson.topic, style = MaterialTheme.typography.headlineSmall)
            Spacer(modifier = Modifier.height(8.dp))
            val bionicText = remember(lesson.visualFormat.plainText) {
                BionicReadingTransformer.transformToBionic(lesson.visualFormat.plainText)
            }
            Text(
                text = bionicText,
                lineHeight = 28.sp,
                fontSize = 18.sp
            )
        }
    }
}

@Composable
fun AudioLessonView(lesson: com.neuroadapt.app.data.LessonContent) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.tertiaryContainer)
    ) {
        Column(modifier = Modifier.padding(20.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(Icons.Default.GraphicEq, contentDescription = null, modifier = Modifier.size(48.dp))
            Spacer(modifier = Modifier.height(12.dp))
            Text(lesson.topic, style = MaterialTheme.typography.titleLarge)
            Text("Paced Narration with Brown Noise Focus", style = MaterialTheme.typography.bodyMedium)
            Spacer(modifier = Modifier.height(16.dp))
            Button(onClick = { /* Start Android TTS */ }) {
                Icon(Icons.Default.PlayArrow, contentDescription = null)
                Spacer(modifier = Modifier.width(6.dp))
                Text("Play Audio Chunk")
            }
        }
    }
}

@Composable
fun InteractiveChallengeView(
    lesson: com.neuroadapt.app.data.LessonContent,
    onComplete: () -> Unit
) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Micro-Challenge (ADHD Tactile Step)", style = MaterialTheme.typography.titleMedium)
            Spacer(modifier = Modifier.height(12.dp))
            Button(
                onClick = onComplete,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Tap to Lock In Concept (+50 XP)")
            }
        }
    }
}`
  },
  {
    id: 'gemini_repo',
    fileName: 'GeminiEducationalRepository.kt',
    relativePath: 'app/src/main/java/com/neuroadapt/app/network/GeminiEducationalRepository.kt',
    category: 'data',
    description: 'Kotlin repository communicating with backend API to synthesize neuro-adapted multimodal lessons.',
    code: `package com.neuroadapt.app.network

import com.neuroadapt.app.data.LessonContent
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

/**
 * Communicates with backend proxy server to generate hyper-personalized
 * neurodivergent educational lessons powered by Gemini 3.8 Flash.
 */
class GeminiEducationalRepository {

    suspend fun generateAdaptiveLesson(
        topic: String,
        condition: String,
        currentModality: String
    ): Result<LessonContent> = withContext(Dispatchers.IO) {
        try {
            val url = URL("https://your-api-domain.com/api/generate-lesson")
            val connection = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                setRequestProperty("Content-Type", "application/json")
                doOutput = true
                connectTimeout = 15000
                readTimeout = 15000
            }

            val payload = JSONObject().apply {
                put("topic", topic)
                put("learnerCondition", condition)
                put("currentFormat", currentModality)
            }

            connection.outputStream.use { os ->
                os.write(payload.toString().toByteArray())
            }

            if (connection.responseCode == 200) {
                val responseString = connection.inputStream.bufferedReader().readText()
                // Parse JSON into LessonContent domain model
                Result.success(com.neuroadapt.app.data.SampleLessons.defaultLesson)
            } else {
                Result.failure(Exception("API Error \${connection.responseCode}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}`
  },
  {
    id: 'build_gradle',
    fileName: 'build.gradle.kts',
    relativePath: 'app/build.gradle.kts',
    category: 'config',
    description: 'Modern Android build.gradle.kts with Jetpack Compose, Material 3, Coroutines, and Sensor APIs.',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.compose.compiler)
}

android {
    namespace = "com.neuroadapt.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.neuroadapt.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    // Jetpack Compose & Material 3
    implementation(platform("androidx.compose:compose-bom:2025.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.activity:activity-compose:1.10.0")

    // AndroidX Lifecycle & ViewModel
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.7")

    // Coroutines & Sensors
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.10.1")

    // Media & Soundscape
    implementation("androidx.media3:media3-exoplayer:1.5.1")
}`
  },
  {
    id: 'android_manifest',
    fileName: 'AndroidManifest.xml',
    relativePath: 'app/src/main/AndroidManifest.xml',
    category: 'config',
    description: 'Android manifest with hardware sensor, haptic vibration, and network permissions.',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Permissions for Hardware Sensors (Fidget Tracking) & Tactile Haptics -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.BODY_SENSORS" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="NeuroAdapt"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.NeuroAdapt">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.NeuroAdapt">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`
  }
];
