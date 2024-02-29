import { CSSProperties } from "react";

import styles from "../styles/keyboard/KeyboardAnimations.module.scss";

import { SLIDE_ANIMATION } from "../lib/keyboardTypes";

export default function getKeyboardAnimation(isAppearing: boolean, selectedAnimation?: SLIDE_ANIMATION, style?: CSSProperties): string {
	if (selectedAnimation) {
		switch (selectedAnimation) {
			case SLIDE_ANIMATION.TOP: return isAppearing ? styles.top_in : styles.top_out;
			case SLIDE_ANIMATION.LEFT: return isAppearing ? styles.left_in : styles.left_out;
			case SLIDE_ANIMATION.RIGHT: return isAppearing ? styles.right_in : styles.right_out;
			case SLIDE_ANIMATION.BOTTOM_LEFT: return isAppearing ? styles.bottom_left_in : styles.bottom_left_out;
			case SLIDE_ANIMATION.BOTTOM_RIGHT: return isAppearing ? styles.bottom_right_in : styles.bottom_right_out;
			case SLIDE_ANIMATION.TOP_LEFT: return isAppearing ? styles.top_left_in : styles.top_left_out;
			case SLIDE_ANIMATION.TOP_RIGHT: return isAppearing ? styles.top_right_in : styles.top_right_out;
			case SLIDE_ANIMATION.BOTTOM:
			default: return isAppearing ? styles.bottom_in : styles.bottom_out;
		}
	}

	if (style) {
		if (!style.bottom) {
			style.bottom = "unset";
		}

		if (style.top == 0) {
			if (style.left == 0) {
				return isAppearing ? styles.top_left_in : styles.top_left_out;
			}

			if (style.right == 0) {
				return isAppearing ? styles.top_right_in : styles.top_right_out;
			}

			return isAppearing ? styles.top_in : styles.top_out;
		}

		if (style.bottom == 0) {
			if (style.left == 0) {
				return isAppearing ? styles.bottom_left_in : styles.bottom_left_out;
			}

			if (style.right == 0) {
				return isAppearing ? styles.bottom_right_in : styles.bottom_right_out;
			}
		}

		if (style.left == 0) {
			return isAppearing ? styles.left_in : styles.left_out;
		}

		if (style.right == 0) {
			return isAppearing ? styles.right_in : styles.right_out;
		}
	}

	return isAppearing ? styles.bottom_in : styles.bottom_out;
}
