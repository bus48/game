window.addEventListener("load", () =>
{

    const m_SvgObject = document.getElementById("gameObject");
    const m_SvgDoc = m_SvgObject.contentDocument;
    const m_Svg = m_SvgDoc.firstElementChild;

    let m_StepIndex = 0;
    let m_InteractionView = false;
    let m_InteractionClock = false;
    let m_InteractionYouLookAtMe = false;
    let m_InteractionLetter = false;

    const VIBRATION_INTERACTION_START = [10];
    const VIBRATION_INTERACTION_CANCEL = [10];
    const VIBRATION_INTERACTION_END = [10, 30, 10];
    const VIBRATION_INTERACTION_INTERRUPT = [100, 650, 30];

    ///////////////////////////////////////////////////////////////////////////////////
    //--- Timeline
    ///////////////////////////////////////////////////////////////////////////////////

    async function RunTimeline()
    {
        ///////////////////////////////////////////////////////////////////////////////
        //--- 1: Fade in
        await Wait(0.25); //--- Fake loading time to make the game look complex
        document.body.classList.remove("is-loading");
        await Wait(0.5);
        SetVisible("scene_exterior", true);
        LogStep("Fade in");
        await Wait(1.5);
        SetVisible("interaction_view", true, true);

        ///////////////////////////////////////////////////////////////////////////////
        //--- 2: Interaction  - move camera
        LogStep("Interaction  - move camera");
        InitInteractionView();
        await WaitUntil(() => m_InteractionView);
        SetVisible("interaction_view", false);
        window.goatcounter.count({path:  'interaction-intro', title: 'Interaction - Intro', event: true})
        if (!m_InteractionClock)
        {
            //m_SvgDoc.getElementById("background_exterior").classList.add("background_exterior");
            m_SvgDoc.getElementById("camera_exterior").classList.add("camera_exterior");
            await Wait(2.5);

            ///////////////////////////////////////////////////////////////////////////////
            //--- 3: I walk in
            LogStep("I walk in");
            SetVisible("me_exterior", true, true);
            SetVisible("me_exterior_walk", true, true);
            await Wait(2.5);

            ///////////////////////////////////////////////////////////////////////////////
            //--- 4: I stand
            LogStep("I stand");
            SetVisible("me_exterior_walk", false);
            SetVisible("me_exterior_stand", true);
            await Wait(1.0);

            ///////////////////////////////////////////////////////////////////////////////
            //--- 5: I look at watch
            LogStep("I look at watch");
            SetVisible("me_exterior_stand", false);
            SetVisible("me_exterior_check_time", true);
            await Wait(1.0);

            ///////////////////////////////////////////////////////////////////////////////
            //--- 6: Show clock
            LogStep("Show clock");
            SetVisible("scene_clock", true, true);
            InitInteractionClock();
            //await Wait(1);
            SetVisible("interaction_clock", true, true);
            await WaitUntil(() => m_InteractionClock);
            window.goatcounter.count({path:  'interaction-watch', title: 'Interaction - Watch', event: true})
            SetVisible("interaction_clock", false);

            ///////////////////////////////////////////////////////////////////////////////
            //--- 7: Hide clock
            LogStep("Hide clock");
            m_SvgDoc.getElementById("scene_clock").classList.add("clock_hide");
            //m_SvgDoc.getElementById("clock_minute").classList.add("clock_hide");
            await Wait(1.5);

            ///////////////////////////////////////////////////////////////////////////////
            //--- 8: Bus arrives
            LogStep("Bus arrives");
            SetVisible("bus_exterior", true, true);
            SetVisible("me_exterior_check_time", false);
            SetVisible("me_exterior_stand", true);
            await Wait(3.5);

            ///////////////////////////////////////////////////////////////////////////////
            //--- 9: Fade out exterior
            LogStep("Fade out exterior");
            m_SvgDoc.getElementById("scene_exterior").classList.add("exterior_hide");
            await Wait(1.5);
        }
        else
        {
            m_StepIndex += 7;
        }

        ///////////////////////////////////////////////////////////////////////////////
        //--- 10: Fade in interior
        LogStep("Fade in interior");
        SetVisible("scene_interior", true, true);
        await Wait(0.5);
        SetVisible("me_interior", true, true);
        SetVisible("me_interior_walk", true, true);
        await Wait(1.0);
        SetVisible("me_interior_walk", false);
        SetVisible("me_interior_stand", true);
        await Wait(1.0);

        ///////////////////////////////////////////////////////////////////////////////
        //--- 11: Crowd walks in
        for (let i = 1; i <= 6; i++)
        {
            SetVisible("crowd_" + i, true, true);
            m_SvgDoc.getElementById("crowd_" + i).firstChild.classList.add("you_interior_walk");
            await Wait(0.3 + 0.02 * i);
        }
        await Wait(2.75);

        ///////////////////////////////////////////////////////////////////////////////
        //--- 12: You walk in
        LogStep("You walk in");
        SetVisible("you_interior", true, true);
        SetVisible("you_interior_walk", true, true);
        await Wait(2.5);

        ///////////////////////////////////////////////////////////////////////////////
        //--- 13: You stand
        LogStep("You stand");
        SetVisible("you_interior_walk", false);
        SetVisible("you_interior_stand", true);
        await Wait(1.0);

        ///////////////////////////////////////////////////////////////////////////////
        //--- 14: Bus leaves
        LogStep("Bus leaves");
        m_SvgDoc.getElementById("bus_interior_speed").classList.add("bus_interior_accelerate");
        m_SvgDoc.getElementById("bus_interior_shake").classList.add("bus_interior_shake");
        m_SvgDoc.getElementById("outside_interior").classList.add("outside_interior");
        await Wait(2.0);

        ///////////////////////////////////////////////////////////////////////////////
        //--- 15: Interaction - you look at me
        LogStep("Interaction - you look at me");
        SetVisible("interaction_look", true, true);
        InitInteractionLook();
        await WaitUntil(() => m_InteractionYouLookAtMe);
        window.goatcounter.count({path:  'interaction-look', title: 'Interaction - Look', event: true})

        ///////////////////////////////////////////////////////////////////////////////
        //--- 16: I get colors
        LogStep("I get colors");
        SetVisible("you_interior_stand", false);
        SetVisible("you_interior_look", true);
        SetVisible("me_interior_look_color", true, true);
        SetVisible("me_interior_stand", false);
        await Wait(0.75); //--- Shared look
        SetVisible("me_interior_look", false);
        SetVisible("me_interior_look_color", false);
        SetVisible("me_interior_stand_color", true);
        await Wait(1.25);
        SetVisible("you_interior_smile", true, true);
        SetVisible("you_interior_look", false);
        await Wait(3.5);

        ///////////////////////////////////////////////////////////////////////////////
        //--- 17: Bus stops
        LogStep("Bus stops");
        m_SvgDoc.getElementById("bus_interior_speed").classList.remove("bus_interior_accelerate");
        m_SvgDoc.getElementById("bus_interior_speed").classList.add("bus_interior_decelerate");
        m_SvgDoc.getElementById("bus_interior_shake").classList.add("pause");
        m_SvgDoc.getElementById("outside_interior").classList.add("pause");
        await Wait(1.5);

        ///////////////////////////////////////////////////////////////////////////////
        //--- 18: Interaction - you leave
        LogStep("Interaction - you leave");
        SetVisible("you_interior_smile", false);
        SetVisible("you_interior_walk", true, true);
        m_SvgDoc.getElementById("you_interior").classList.add("you_interior_leave");
        await Wait(1.5);
        SetVisible("me_interior_look_color", true);
        await Wait(1.5);

        ///////////////////////////////////////////////////////////////////////////////
        //--- 19: Bus leaves
        LogStep("Bus leaves");
        m_SvgDoc.getElementById("bus_interior_speed").classList.remove("bus_interior_decelerate");
        m_SvgDoc.getElementById("bus_interior_speed").classList.add("bus_interior_accelerate");
        m_SvgDoc.getElementById("bus_interior_shake").classList.remove("pause");
        m_SvgDoc.getElementById("outside_interior").classList.remove("pause");
        SetVisible("glow_outro_1", true, true);
        await Wait(1.0);
        SetVisible("glow_outro_2", true, true);
        await Wait(1.0);
        SetVisible("glow_outro_3", true, true);
        await Wait(0.5);
        //m_SvgObject.classList.add("game_outro");

        ///////////////////////////////////////////////////////////////////////////////
        //--- 20: World gets colors
        //LogStep("World gets colors");
        //await Wait(1.0);

        ///////////////////////////////////////////////////////////////////////////////
        //--- 20: The end
        LogStep("The end");
        await Wait(0.5);
        SetVisible("text_outro", true, true);
		/*
        await Wait(2.0);
        SetVisible("text_about", true, true);
        InitInteractionLetter();
        await WaitUntil(() => m_InteractionLetter);

        ///////////////////////////////////////////////////////////////////////////////
        //--- Epilogue: Letter
        SetVisible("letter", true, true);
        window.goatcounter.count({path:  'interaction-letter', title: 'Interaction - Letter', event: true})
		*/
    }

    function Wait(s)
    {
        return new Promise(resolve => setTimeout(resolve, s * 1000));
    }

    function WaitUntil(conditionFn, interval = 50)
    {
        return new Promise(resolve => {
            const check = () => {
                if (conditionFn()) {
                    resolve();
                } else {
                    setTimeout(check, interval);
                }
            };

            check();
        });
    }

    function LogStep(name)
    {
        m_StepIndex++;
        console.log("Animation step " + m_StepIndex + ": " + name);
    }

    function SetVisible(elementName, visible, initAnimation = false)
    {
        const element = m_SvgDoc.getElementById(elementName);
        element.style.display = visible ? "block" : "none";
        //element.style.visibility = visible ? "visible" : "hidden";
        if (visible && initAnimation)
            element.classList.add(elementName);
        else if (!visible)
            element.classList.remove(elementName);
    }

    function Vibrate(pattern)
    {
        const canVibrate = window.navigator.vibrate;
        if (canVibrate)
            window.navigator.vibrate(pattern);
    }

    RunTimeline();

    ///////////////////////////////////////////////////////////////////////////////////
    //--- Cheats
    ///////////////////////////////////////////////////////////////////////////////////

    m_Svg.addEventListener("keydown", OnCheatKeyDown, {passive: false});
    function OnCheatKeyDown(ev)
    {
        if (ev.key === "1")
        {
            m_InteractionView = true;
        }
        else if (ev.key === "2")
        {
            m_AreYouThere = true;
            m_InteractionClock = true;
        }
        else if (ev.key === "3")
        {
            m_InteractionYouLookAtMe = true;
        }
        else if (ev.key === "4")
        {
            m_InteractionClock = true;
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////
    //--- Interaction
    ///////////////////////////////////////////////////////////////////////////////////
    function InitInteractionView()
    {
        const m_InteractionViewCircle = m_SvgDoc.getElementById("interaction_view_circle");
        const m_InteractionViewLine = m_SvgDoc.getElementById("interaction_view_line");
        const m_LineStartY = parseFloat(m_InteractionViewLine.getAttribute("y")) || 0;
        const m_LineEndY = m_LineStartY + (parseFloat(m_InteractionViewLine.getAttribute("height")) || 0);
        const m_TriggerThreshold = m_LineEndY - 5;
        const viewBox = m_Svg.getAttribute("viewBox");
        const [, , m_ViewBoxWidth, m_ViewBoxHeight] = viewBox.split(" ").map(Number);
        let m_SvgRect = null;
        let m_IsDragging = false;
        let m_CurrentCircleY = m_LineStartY;
        let m_DragStartClientY = 0;
        let m_DragStartCircleY = m_LineStartY;

        SetCircleY(m_LineStartY, false);
        m_Svg.addEventListener("pointerdown", OnViewPointerDown);
        m_Svg.addEventListener("pointermove", OnViewPointerMove);
        m_Svg.addEventListener("pointerup", OnViewPointerUp);
        m_Svg.addEventListener("pointercancel", OnViewPointerUp);
        m_Svg.addEventListener("touchstart", OnViewTouchStart, {passive: false});
        m_Svg.addEventListener("touchmove", OnViewTouchMove, {passive: false});
        m_Svg.addEventListener("touchend", OnViewTouchEnd, {passive: false});
        m_Svg.addEventListener("touchcancel", OnViewTouchEnd, {passive: false});

        m_InteractionViewCircle.classList.add("interaction_tutorial");

        function OnViewPointerDown(ev)
        {
            if (!IsOnHandle(ev.clientX, ev.clientY, false))
                return;

            StartDragging(ev.clientY);
        }

        function OnViewPointerMove(ev)
        {
            if (!m_IsDragging)
                return;

            UpdateInteractionView(ev.clientY);
        }

        function OnViewPointerUp()
        {
            if (!m_IsDragging)
                return;

            m_IsDragging = false;
            CompleteOrReset();
        }

        function OnViewTouchStart(ev)
        {
            const touch = ev.touches[0];
            if (!touch || !IsOnHandle(touch.clientX, touch.clientY, true))
                return;

            ev.preventDefault();
            StartDragging(touch.clientY);
        }

        function OnViewTouchMove(ev)
        {
            if (!m_IsDragging)
                return;

            ev.preventDefault();
            const touch = ev.touches[0];
            if (!touch)
                return;

            UpdateInteractionView(touch.clientY);
        }

        function OnViewTouchEnd(ev)
        {
            if (!m_IsDragging)
                return;

            ev.preventDefault();
            m_IsDragging = false;
            CompleteOrReset();
        }

        function StartDragging(clientY)
        {
            m_IsDragging = true;
            m_SvgRect = m_Svg.getBoundingClientRect();
            m_DragStartClientY = clientY;
            m_DragStartCircleY = m_CurrentCircleY;
            SetCircleY(m_CurrentCircleY, false);
            m_InteractionViewCircle.classList.remove("interaction_tutorial");
            Vibrate(VIBRATION_INTERACTION_START);
        }

        function IsOnHandle(clientX, clientY, isTouch)
        {
            const offset = isTouch ? 50 : 0;
            const circleRect = m_InteractionViewCircle.getBoundingClientRect();
            return clientX >= circleRect.left - offset && clientX <= circleRect.right + offset
                && clientY >= circleRect.top - offset && clientY <= circleRect.bottom + offset;
        }

        function UpdateInteractionView(clientY)
        {
            if (!m_SvgRect)
                return;

            const scale = Math.min(m_SvgRect.width / m_ViewBoxWidth, m_SvgRect.height / m_ViewBoxHeight);
            const deltaY = (clientY - m_DragStartClientY) / scale;
            const localY = Math.min(m_LineEndY, Math.max(m_LineStartY, m_DragStartCircleY + deltaY));

            SetCircleY(localY, false);
        }

        function CompleteOrReset()
        {
            if (m_CurrentCircleY >= m_TriggerThreshold)
            {
                SetCircleY(m_LineEndY, false);
                m_InteractionView = true;
                RemoveListeners();
                Vibrate(VIBRATION_INTERACTION_END);
                return;
            }
            else
            {
                Vibrate(VIBRATION_INTERACTION_CANCEL);
            }

            SetCircleY(m_LineStartY, true);
        }

        function SetCircleY(y, animate)
        {
            m_CurrentCircleY = y;
            m_InteractionViewCircle.style.transition = animate ? "y 180ms ease-out" : "none";
            m_InteractionViewCircle.setAttribute("y", y);
        }

        function RemoveListeners()
        {
            m_Svg.removeEventListener("pointerdown", OnViewPointerDown);
            m_Svg.removeEventListener("pointermove", OnViewPointerMove);
            m_Svg.removeEventListener("pointerup", OnViewPointerUp);
            m_Svg.removeEventListener("pointercancel", OnViewPointerUp);
            m_Svg.removeEventListener("touchstart", OnViewTouchStart);
            m_Svg.removeEventListener("touchmove", OnViewTouchMove);
            m_Svg.removeEventListener("touchend", OnViewTouchEnd);
            m_Svg.removeEventListener("touchcancel", OnViewTouchEnd);
        }
    }
    
    function InitInteractionClock()
    {
        const m_ClockHour = m_SvgDoc.getElementById("clock_hour");
        const m_ClockMinute = m_SvgDoc.getElementById("clock_minute");
        const m_ClockSvg = m_SvgDoc.getElementById("scene_clock");
        const m_InteractionClockLine = m_SvgDoc.getElementById("interaction_clock_line");
        const m_InteractionClockCircle = m_SvgDoc.getElementById("interaction_clock_circle");
        const m_ClockX = parseFloat(m_ClockSvg.getAttribute("x")) || 0;
        const m_ClockY = parseFloat(m_ClockSvg.getAttribute("y")) || 0;
        const m_ClockWidth = parseFloat(m_ClockSvg.getAttribute("width")) || 500;
        const m_ClockHeight = parseFloat(m_ClockSvg.getAttribute("height")) || 700;
        const m_CenterX = m_ClockWidth / 2;
        const m_CenterY = m_ClockHeight / 2;
        const viewBox = m_Svg.getAttribute("viewBox");
        const [, , m_ViewBoxWidth, m_ViewBoxHeight] = viewBox.split(' ').map(Number);
        let m_IsPointerDown = false;
        let m_SvgRect = null;
        let m_DefaultAngle = 300;
        let m_IsAngleChanged = false;

        SetHandAngle(m_DefaultAngle);
        m_Svg.addEventListener("pointerdown", OnClockPointerDown);
        m_Svg.addEventListener("pointerup", OnClockPointerUp);
        m_Svg.addEventListener("touchstart", OnClockTouchStart, {passive: false});
        m_Svg.addEventListener("touchend", OnClockTouchEnd, {passive: false});

        function OnClockPointerDown(ev)
        {
            if (!IsOnHandle(ev.clientX, ev.clientY, false))
                return;

            m_IsPointerDown = true;
            m_IsAngleChanged = false;
            m_SvgRect = m_Svg.getBoundingClientRect();
            m_Svg.addEventListener("pointermove", OnClockPointerMove);
            OnClockPointerMove(ev);
        }

        function OnClockPointerUp(ev)
        {
            m_IsPointerDown = false;
            m_Svg.removeEventListener("pointermove", OnClockPointerMove);
            if (m_IsAngleChanged)
                ClockSet();
            else
                Vibrate(VIBRATION_INTERACTION_CANCEL);
        }

        function OnClockTouchStart(ev)
        {
            const touch = ev.touches[0];
            if (!touch || !IsOnHandle(touch.clientX, touch.clientY, true))
                return;

            ev.preventDefault();
            m_IsPointerDown = true;
            m_SvgRect = m_Svg.getBoundingClientRect();
            m_Svg.addEventListener("touchmove", OnClockTouchMove, {passive: false});
            OnClockTouchMove(ev);
            Vibrate(VIBRATION_INTERACTION_START);
        }

        function OnClockTouchEnd(ev)
        {
            ev.preventDefault();
            m_IsPointerDown = false;
            m_Svg.removeEventListener("touchmove", OnClockTouchMove);
            if (m_IsAngleChanged)
                ClockSet();
            else
                Vibrate(VIBRATION_INTERACTION_CANCEL);
        }

        function OnClockPointerMove(ev)
        {
            if (!m_IsPointerDown || !m_SvgRect)
                return;

            UpdateClockRotation(ev.clientX, ev.clientY);
        }

        function OnClockTouchMove(ev)
        {
            if (!m_IsPointerDown || !m_SvgRect)
                return;

            ev.preventDefault();
            const touch = ev.touches[0];
            UpdateClockRotation(touch.clientX, touch.clientY);
        }

        function IsOnHandle(clientX, clientY, isTouch)
        {
            const offset = isTouch ? 50 : 0;
            const circleRect = m_InteractionClockCircle.getBoundingClientRect();
            return clientX >= circleRect.left - offset && clientX <= circleRect.right + offset
                && clientY >= circleRect.top - offset && clientY <= circleRect.bottom + offset;
        }

        function UpdateClockRotation(evX, evY)
        {
            const scale = Math.min(m_SvgRect.width / m_ViewBoxWidth, m_SvgRect.height / m_ViewBoxHeight);
            const centerX = m_SvgRect.width / 2;
            const centerY = m_SvgRect.height / 2;
            const svgX = ((evX - centerX) / scale) + (m_ViewBoxWidth / 2);
            const svgY = ((evY - centerY) / scale) + (m_ViewBoxHeight / 2);

            const localX = svgX - m_ClockX;
            const localY = svgY - m_ClockY;
            const dx = localX - m_CenterX;
            const dy = localY - m_CenterY;
            let angle = Math.atan2(dy, dx) * 180 / Math.PI - 90;
            SetHandAngle(Repeat(angle + 180, 360));
        }

        function Repeat(t, length)
        {
            return t - Math.floor(t / length) * length;
        }

        function SetHandAngle(angle)
        {
            // Snap to nearest 5 minutes (30 degrees)
            let angleSnapped = Math.round(angle / 30) * 30;
            if (angleSnapped !== m_DefaultAngle)
            {
                m_IsAngleChanged = angleSnapped == 0 || angleSnapped == 360;
                m_AreYouThere = true;//angleSnapped == 90 || angleSnapped == -270;
            }

            let angleHour = Repeat(angleSnapped - 180, 360);
            m_ClockMinute.setAttribute("transform", `rotate(${angleSnapped}, ${m_CenterX}, ${m_CenterY})`);
            m_ClockHour.setAttribute("transform", `rotate(${255 + 30 * (angleHour / 360)}, ${m_CenterX}, ${m_CenterY})`);
            //m_InteractionClockCircle.setAttribute("transform", `rotate(${angleSnapped + 90}, ${m_ClockWidth * 0.5}, ${m_ClockHeight * 0.5})`);

            const radius = 245;      // old orbit radius: 275 - 30
            const radians = angleSnapped * Math.PI / 180;

            const handleCenterX = m_CenterX + radius * Math.sin(radians);
            const handleCenterY = m_CenterY - radius * Math.cos(radians);

            m_InteractionClockCircle.setAttribute("x", handleCenterX);
            m_InteractionClockCircle.setAttribute("y", handleCenterY);
        }

        function ClockSet()
        {
            m_InteractionClock = true;
            m_Svg.removeEventListener("pointerdown", OnClockPointerDown);
            m_Svg.removeEventListener("pointerup", OnClockPointerUp);
            m_Svg.removeEventListener("touchstart", OnClockTouchStart);
            m_Svg.removeEventListener("touchend", OnClockTouchEnd);
            Vibrate(VIBRATION_INTERACTION_END);
        }
    }

    function InitInteractionLook()
    {
        const m_InteractionLookCircle = m_SvgDoc.getElementById("interaction_look_circle");
        const m_InteractionLookLine = m_SvgDoc.getElementById("interaction_look_line");
        const m_LineStartX = parseFloat(m_InteractionLookLine.getAttribute("x")) || 0;
        const m_LineEndX = m_LineStartX + (parseFloat(m_InteractionLookLine.getAttribute("width")) || 0);
        const m_StartX = m_LineStartX;
        const m_TriggerThreshold = m_LineEndX - 60;
        const viewBox = m_Svg.getAttribute("viewBox");
        const [, , m_ViewBoxWidth, m_ViewBoxHeight] = viewBox.split(" ").map(Number);
        let m_SvgRect = null;
        let m_IsDragging = false;
        let m_CurrentCircleX = m_StartX;
        let m_DragStartClientX = 0;
        let m_DragStartCircleX = m_StartX;

        SetCircleX(m_StartX, false);
        m_Svg.addEventListener("pointerdown", OnLookPointerDown);
        m_Svg.addEventListener("pointermove", OnLookPointerMove);
        m_Svg.addEventListener("pointerup", OnLookPointerUp);
        m_Svg.addEventListener("pointercancel", OnLookPointerUp);
        m_Svg.addEventListener("touchstart", OnLookTouchStart, {passive: false});
        m_Svg.addEventListener("touchmove", OnLookTouchMove, {passive: false});
        m_Svg.addEventListener("touchend", OnLookTouchEnd, {passive: false});
        m_Svg.addEventListener("touchcancel", OnLookTouchEnd, {passive: false});

        function OnLookPointerDown(ev)
        {
            if (!IsOnHandle(ev.clientX, ev.clientY, false))
                return;

            StartDragging(ev.clientX);
        }

        function OnLookPointerMove(ev)
        {
            if (!m_IsDragging)
                return;

            UpdateInteractionLook(ev.clientX);
        }

        function OnLookPointerUp()
        {
            if (!m_IsDragging)
                return;

            Reset();
        }

        function OnLookTouchStart(ev)
        {
            const touch = ev.touches[0];
            if (!touch || !IsOnHandle(touch.clientX, touch.clientY, true))
                return;

            ev.preventDefault();
            StartDragging(touch.clientX);
        }

        function OnLookTouchMove(ev)
        {
            if (!m_IsDragging)
                return;

            ev.preventDefault();
            const touch = ev.touches[0];
            if (!touch)
                return;

            UpdateInteractionLook(touch.clientX);
        }

        function OnLookTouchEnd(ev)
        {
            if (!m_IsDragging)
                return;

            ev.preventDefault();
            Reset();
        }

        function StartDragging(clientX)
        {
            m_IsDragging = true;
            m_SvgRect = m_Svg.getBoundingClientRect();
            m_DragStartClientX = clientX;
            m_DragStartCircleX = m_CurrentCircleX;
            SetCircleX(m_CurrentCircleX, false);
            Vibrate(VIBRATION_INTERACTION_START);
        }

        function IsOnHandle(clientX, clientY, isTouch)
        {
            const offset = isTouch ? 50 : 0;
            const circleRect = m_InteractionLookCircle.getBoundingClientRect();
            return clientX >= circleRect.left - offset && clientX <= circleRect.right + offset
                && clientY >= circleRect.top - offset && clientY <= circleRect.bottom + offset;
        }

        function UpdateInteractionLook(clientX)
        {
            if (!m_SvgRect)
                return;

            const scale = Math.min(m_SvgRect.width / m_ViewBoxWidth, m_SvgRect.height / m_ViewBoxHeight);
            const deltaX = (clientX - m_DragStartClientX) / scale;
            const localX = Math.min(m_LineEndX, Math.max(m_LineStartX, m_DragStartCircleX + deltaX));

            SetCircleX(localX, false);
        }
        
        function Reset()
        {
            m_IsDragging = false;
            SetCircleX(0, true);
            Vibrate(VIBRATION_INTERACTION_CANCEL);
        }

        function SetCircleX(x, animate)
        {
            SetVisible("me_interior_look", x > 30);
            SetVisible("me_interior_stand", x <= 30);
            m_CurrentCircleX = x;
            m_InteractionLookCircle.style.transition = animate ? "x 180ms ease-out" : "none";
            m_InteractionLookCircle.setAttribute("x", x);

            if (m_CurrentCircleX >= m_TriggerThreshold)
            {
                SetVisible("interaction_look", false);
                m_InteractionYouLookAtMe = true;
                RemoveListeners();
                Vibrate(VIBRATION_INTERACTION_INTERRUPT);
            }
        }

        function RemoveListeners()
        {
            m_Svg.removeEventListener("pointerdown", OnLookPointerDown);
            m_Svg.removeEventListener("pointermove", OnLookPointerMove);
            m_Svg.removeEventListener("pointerup", OnLookPointerUp);
            m_Svg.removeEventListener("pointercancel", OnLookPointerUp);
            m_Svg.removeEventListener("touchstart", OnLookTouchStart);
            m_Svg.removeEventListener("touchmove", OnLookTouchMove);
            m_Svg.removeEventListener("touchend", OnLookTouchEnd);
            m_Svg.removeEventListener("touchcancel", OnLookTouchEnd);
        }
    }

    function InitInteractionLetter()
    {
        m_Svg.addEventListener("pointerdown", OnPointerDown);
        m_Svg.addEventListener("touchstart", OnTouchStart, {passive: false});

        function OnPointerDown(ev)
        {
            ShowLetter();
        }

        function OnTouchStart(ev)
        {
            const touch = ev.touches[0];
            if (!touch)
                return;

            ev.preventDefault();
            ShowLetter();
        }

        function ShowLetter()
        {
            m_InteractionLetter = true;
        }
    }
});
