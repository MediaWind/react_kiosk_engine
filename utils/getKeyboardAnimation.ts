import { CSSProperties } from "react";

import styles from "../styles/keyboard/KeyboardAnimations.module.scss";

export default function getKeyboardAnimation(isAppearing: boolean, style?: CSSProperties): string {
	if (style) {
		if (!style.bottom) {
			style.bottom = "unset";
		}

		if (style.top == 0) {
			if (style.left == 0) {
				return isAppearing ? styles.left_top_in : styles.left_top_out;
			}

			if (style.right == 0) {
				return isAppearing ? styles.right_top_in : styles.right_top_out;
			}

			return isAppearing ? styles.top_in : styles.top_out;
		}

		if (style.bottom == 0) {
			if (style.left == 0) {
				return isAppearing ? styles.left_bottom_in : styles.left_bottom_out;
			}

			if (style.right == 0) {
				return isAppearing ? styles.right_bottom_in : styles.right_bottom_out;
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
